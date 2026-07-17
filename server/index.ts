import express from "express";
import { createServer } from "http";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, "..", "data");
const MEMBERS_FILE = path.join(DATA_DIR, "members.json");

async function ensureMembersFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(MEMBERS_FILE);
  } catch {
    await fs.writeFile(MEMBERS_FILE, JSON.stringify([], null, 2), "utf8");
  }
}

async function startServer() {
  await ensureMembersFile();

  const app = express();
  const server = createServer(app);

  app.use(express.json({ limit: "5mb" }));

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.get("/api/members", async (_req, res) => {
    try {
      const content = await fs.readFile(MEMBERS_FILE, "utf8");
      res.json(content ? JSON.parse(content) : []);
    } catch (error) {
      console.error("Failed to load members", error);
      res.status(500).json({ error: "Unable to load members" });
    }
  });

  app.post("/api/members", async (req, res) => {
    try {
      const members = req.body;
      if (!Array.isArray(members)) {
        res.status(400).json({ error: "Invalid payload" });
        return;
      }

      await fs.writeFile(
        MEMBERS_FILE,
        JSON.stringify(members, null, 2),
        "utf8"
      );
      res.json({ ok: true, saved: members.length });
    } catch (error) {
      console.error("Failed to save members", error);
      res.status(500).json({ error: "Unable to save members" });
    }
  });

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
