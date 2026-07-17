import { motion, AnimatePresence } from "framer-motion";
import {
  Cpu,
  Cable,
  BookOpen,
  Code2,
  HelpCircle,
  Wifi,
  Camera,
  Monitor,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import CodeEditor from "../components/CodeEditor";
import ComponentCard from "../components/ComponentCard";
import Controller from "../components/Controller";
import FAQAccordion from "../components/FAQAccordion";
import SectionHeader from "../components/SectionHeader";
import { toast } from "sonner";

type Direction = "forward" | "backward" | "left" | "right" | "stop";

const components = [
  {
    name: "ESP32",
    nameKh: "ESP32",
    description: "Microcontroller WiFi/Bluetooth ។",
    emoji: "📟",
  },
  {
    name: "ESP32-CAM",
    nameKh: "ESP32-CAM",
    description: "Module Camera + WiFi ។",
    emoji: "📷",
  },
  {
    name: "L298N Motor Driver",
    nameKh: "Motor Driver",
    description: "ដំណើរការម៉ូទ័រ ។",
    emoji: "⚡",
  },
  {
    name: "Camera Module",
    nameKh: "Camera",
    description: "OV2640 Camera 2MP ។",
    emoji: "🎥",
  },
  {
    name: "Battery",
    nameKh: "ថ្ម",
    description: "ផ្គត់ផ្គង់ថាមពល ។",
    emoji: "🔋",
  },
];

const esp32Code = `#include <WiFi.h>
#include <WebServer.h>
#include "esp_camera.h"
const char* ssid = "RC_CAR";
const char* password = "12345678";
#define IN1 12
#define IN2 13
#define IN3 14
#define IN4 15

WebServer server(80);

void setup() {
  Serial.begin(115200);
  
  pinMode(IN1, OUTPUT); pinMode(IN2, OUTPUT);
  pinMode(IN3, OUTPUT); pinMode(IN4, OUTPUT);

  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = 5;
  config.pin_d1 = 18;
  config.pin_d2 = 19;
  config.pin_d3 = 21;
  config.pin_d4 = 36;
  config.pin_d5 = 39;
  config.pin_d6 = 34;
  config.pin_d7 = 35;
  config.pin_xclk = 0;
  config.pin_pclk = 22;
  config.pin_vsync = 25;
  config.pin_href = 23;
  config.pin_sscb_sda = 26;
  config.pin_sscb_scl = 27;
  config.pin_pwdn = 32;
  config.pin_reset = -1;
  config.xclk_freq_hz = 20000000;
  config.pixel_format = PIXFORMAT_JPEG;
  config.frame_size = FRAMESIZE_VGA;
  config.jpeg_quality = 10;
  config.fb_count = 2;
  
  esp_camera_init(&config);
  
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\\nConnected! IP: " + WiFi.localIP().toString());
  
  server.on("/", handleRoot);
  server.on("/stream", handleStream);
  server.on("/control", handleControl);
  server.begin();
}

void loop() {
  server.handleClient();
}

void handleControl() {
  String cmd = server.arg("cmd");
  if (cmd == "F") moveForward();
  else if (cmd == "B") moveBackward();
  else if (cmd == "L") turnLeft();
  else if (cmd == "R") turnRight();
  else stopCar();
  server.send(200, "text/plain", "OK");
}

void moveForward() {
  digitalWrite(IN1, HIGH); digitalWrite(IN2, LOW);
  digitalWrite(IN3, HIGH); digitalWrite(IN4, LOW);
}
void moveBackward() {
  digitalWrite(IN1, LOW); digitalWrite(IN2, HIGH);
  digitalWrite(IN3, LOW); digitalWrite(IN4, HIGH);
}
void turnLeft() {
  digitalWrite(IN1, LOW); digitalWrite(IN2, HIGH);
  digitalWrite(IN3, HIGH); digitalWrite(IN4, LOW);
}
void turnRight() {
  digitalWrite(IN1, HIGH); digitalWrite(IN2, LOW);
  digitalWrite(IN3, LOW); digitalWrite(IN4, HIGH);
}
void stopCar() {
  digitalWrite(IN1, LOW); digitalWrite(IN2, LOW);
  digitalWrite(IN3, LOW); digitalWrite(IN4, LOW);
}

void handleRoot() {
  server.send(200, "text/html", "<h1>ESP32-CAM RC Car</h1>");
}

void handleStream() {
  WiFiClient client = server.client();
  String response = "HTTP/1.1 200 OK\\r\\n";
  response += "Content-Type: multipart/x-mixed-replace; boundary=frame\\r\\n\\r\\n";
  client.print(response);
  
  while (client.connected()) {
    camera_fb_t* fb = esp_camera_fb_get();
    if (!fb) continue;
    
    client.printf("--frame\\r\\nContent-Type: image/jpeg\\r\\nContent-Length: %u\\r\\n\\r\\n", fb->len);
    client.write(fb->buf, fb->len);
    client.print("\\r\\n");
    esp_camera_fb_return(fb);
  }
}`;

const faqItems = [
  {
    question: "ហេតុអ្វីបានជា Camera មិនដំណើរការ ?",
    answer:
      "ត្រូតពិនិត្យ WiFi Connection ។ ត្រូប្រាកដថា IP Address ត្រឹមត្រូវ ។ ពិនិត្យ Camera Config ។​ ម្យ៉ាងទៀត អាចមានបញ្ហាផ្នែក Hardware ។",
  },
  {
    question: "ហេតុអ្វីបានជា IP Unreachable?",
    answer:
      "ត្រូប្រាកដថា ESP32 និង Device ស្ថិតនៅ WiFi Network តែមួយ ។ ពិនិត្យ Firewall ។",
  },
];

function StreamingDashboard() {
  const [esp32IP, setEsp32IP] = useState("192.168.1.100");
  const [camIP, setCamIP] = useState("192.168.1.101");
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [lastCmd, setLastCmd] = useState<Direction | null>(null);
  const [cmdLog, setCmdLog] = useState<string[]>([]);

  const handleConnect = () => {
    setConnecting(true);
    setTimeout(() => {
      setConnecting(false);
      setConnected(true);
      toast.success("ភ្ជាប់ ESP32 បានជោគជ័យ (Demo Mode)");
    }, 1500);
  };

  const handleDisconnect = () => {
    setConnected(false);
    setLastCmd(null);
    toast.info("ផ្តាច់ការភ្ជាប់");
  };

  const handleCommand = (dir: Direction) => {
    if (!connected) {
      toast.error("ភ្ជាប់ ESP32 ជាមុនសិន");
      return;
    }
    setLastCmd(dir);
    const cmdMap: Record<Direction, string> = {
      forward: "F",
      backward: "B",
      left: "L",
      right: "R",
      stop: "S",
    };
    const labelMap: Record<Direction, string> = {
      forward: "ទៅមុខ",
      backward: "ថយក្រោយ",
      left: "ឆ្វេង",
      right: "ស្តាំ",
      stop: "ឈប់",
    };
    const log = `GET http://${esp32IP}/control?cmd=${cmdMap[dir]} → ${labelMap[dir]}`;
    setCmdLog(prev => [log, ...prev.slice(0, 4)]);
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Wifi size={16} className="text-primary" />
          <h3 className="text-sm font-bold font-['Battambang']">
            ការភ្ជាប់ ESP32
          </h3>
          <span
            className={`ml-auto px-2 py-0.5 rounded-full text-xs font-['Inter'] ${
              connected
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : "bg-red-500/20 text-red-400 border border-red-500/30"
            }`}
          >
            {connected ? "● Connected" : "○ Disconnected"}
          </span>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs text-muted-foreground font-['Battambang'] block mb-1">
              ESP32 IP Address
            </label>
            <input
              type="text"
              value={esp32IP}
              onChange={e => setEsp32IP(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm font-mono text-foreground focus:outline-none focus:border-primary/50"
              placeholder="192.168.1.100"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground font-['Battambang'] block mb-1">
              ESP32-CAM IP Address
            </label>
            <input
              type="text"
              value={camIP}
              onChange={e => setCamIP(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm font-mono text-foreground focus:outline-none focus:border-primary/50"
              placeholder="192.168.1.101"
            />
          </div>
        </div>

        <div className="flex gap-3">
          {!connected ? (
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={handleConnect}
              disabled={connecting}
              className="px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-['Battambang'] hover:bg-primary/80 transition-colors disabled:opacity-50"
            >
              {connecting ? "កំពុងភ្ជាប់..." : "ភ្ជាប់"}
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={handleDisconnect}
              className="px-5 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-sm font-['Battambang'] hover:bg-red-500/30 transition-colors"
            >
              ផ្តាច់
            </motion.button>
          )}
        </div>
      </div>

      {/* Camera Feed + Controller */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Camera Feed */}
        <div className="glass-card overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/8">
            <Camera size={16} className="text-primary" />
            <span className="text-sm font-['Battambang']">Camera Feed</span>
            {connected && (
              <span className="ml-auto flex items-center gap-1 text-xs text-green-400">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                LIVE
              </span>
            )}
          </div>
          <div className="aspect-video bg-black/50 flex items-center justify-center relative overflow-hidden">
            {connected ? (
              <>
                {/* Demo stream visualization */}
                <div className="absolute inset-0 bg-linear-to-br from-gray-900 to-black">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Camera
                        size={48}
                        className="text-primary/40 mx-auto mb-3"
                      />
                      <p className="text-sm text-muted-foreground font-['Battambang']">
                        Demo Stream
                      </p>
                      <p className="text-xs text-muted-foreground font-mono mt-1">
                        {camIP}:81/stream
                      </p>
                    </div>
                  </div>
                  {/* Scan lines effect */}
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)",
                    }}
                  />
                </div>
                {/* Corner overlays */}
                <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-primary/60" />
                <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-primary/60" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-primary/60" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-primary/60" />
              </>
            ) : (
              <div className="text-center">
                <Monitor
                  size={40}
                  className="text-muted-foreground/30 mx-auto mb-2"
                />
                <p className="text-sm text-muted-foreground font-['Battambang']">
                  ភ្ជាប់ ESP32-CAM ជាមុនសិន
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Controller */}
        <div className="glass-card p-6 flex flex-col items-center justify-center gap-4">
          <Controller onCommand={handleCommand} activeCommand={lastCmd} />

          {/* Command log */}
          <AnimatePresence>
            {cmdLog.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="w-full"
              >
                <p className="text-xs text-muted-foreground font-['Inter'] mb-2">
                  HTTP Log:
                </p>
                <div className="space-y-1">
                  {cmdLog.map((log, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1 - i * 0.2, x: 0 }}
                      className="text-xs font-mono text-green-400/80 truncate"
                    >
                      {log}
                    </motion.p>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function StreamingCar() {
  return (
    <div className="min-h-screen">
      <div className="relative py-12 border-b border-white/8 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-purple-600/10 to-transparent" />
        <div className="container relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="pin-badge">Page 3</span>
            <span className="pin-badge">Live Streaming</span>
          </div>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-bold font-['Battambang'] text-foreground mb-2">
                RC Car Streaming
              </h1>
              <p className="text-muted-foreground font-['Hanuman'] max-w-2xl">
                RC Car Streaming with ESP32-CAM — Live Video + WiFi Control with
                a polished dashboard experience
              </p>
            </div>
            <div className="glass-card px-4 py-3 flex items-center gap-3">
              <div className="rounded-full bg-purple-500/15 p-2 text-purple-400">
                <Sparkles size={16} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Connected dashboard
                </p>
                <p className="text-xs text-muted-foreground">
                  តាមដាន feed និងបញ្ជារថយន្តពីកន្លែងតែមួយ
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-10 space-y-14">
        <section>
          <SectionHeader icon={Cpu} title="សមាសភាគ" subtitle="Components" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {components.map((c, i) => (
              <ComponentCard key={c.name} {...c} delay={i * 0.06} />
            ))}
          </div>
        </section>

        <section>
          <SectionHeader
            icon={Cable}
            title="ការភ្ជាប់ Pin"
            subtitle="Wiring"
            accent="cyan"
          />
          <div className="glass-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8">
                  <th className="text-left px-4 py-3 text-muted-foreground font-['Inter']">
                    ប្រភព
                  </th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-['Inter']">
                    គោលដៅ
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["ESP32 Pin 12", "L298N IN1"],
                  ["ESP32 Pin 13", "L298N IN2"],
                  ["ESP32 Pin 14", "L298N IN3"],
                  ["ESP32 Pin 15", "L298N IN4"],
                  ["ESP32-CAM GPIO0", "FTDI RX (Flash mode)"],
                  ["ESP32-CAM 5V", "Power Supply 5V"],
                  ["ESP32 GND", "L298N GND"],
                ].map(([from, to], i) => (
                  <tr
                    key={i}
                    className="border-b border-white/5 hover:bg-white/3"
                  >
                    <td className="px-4 py-2.5">
                      <span className="pin-badge">{from}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="pin-badge">{to}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <SectionHeader
            icon={BookOpen}
            title="ការពន្យល់"
            subtitle="Live video streaming explained"
          />
          <div className="glass-card glow-card p-6">
            <p className="text-sm text-muted-foreground font-['Hanuman'] leading-relaxed">
              ESP32-CAM ផ្ញើ Video Stream តាម WiFi ។ Browser ភ្ជាប់ទៅ IP Address
              របស់ ESP32-CAM ។ ការបញ្ជារថយន្តធ្វើតាម HTTP Request ទៅ ESP32 ។
              ESP32 ទទួលសញ្ញាបញ្ជា ហើយបញ្ជា Motor Driver ។
              ប្រព័ន្ធនេះអនុញ្ញាតឱ្យបញ្ជារថយន្ត ខណៈពេលដែលមើល Video ផ្ទាល់ ។
            </p>
          </div>
        </section>

        <section>
          <SectionHeader
            icon={Wifi}
            title="Dashboard & Streaming"
            subtitle="Connect and control"
            accent="cyan"
          />
          <StreamingDashboard />
        </section>

        <section>
          <SectionHeader
            icon={Code2}
            title="កូដ ESP32"
            subtitle="Editable source code"
            accent="cyan"
          />
          <CodeEditor
            initialCode={esp32Code}
            title="ESP32-CAM Streaming Car"
            language="C++/ESP32"
          />
        </section>

        <section>
          <SectionHeader
            icon={HelpCircle}
            title="សំណួរ & ចម្លើយ"
            subtitle="FAQ"
            accent="gold"
          />
          <FAQAccordion items={faqItems} />
        </section>
      </div>
    </div>
  );
}
