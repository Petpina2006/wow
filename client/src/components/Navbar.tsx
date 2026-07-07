
import { motion } from "framer-motion";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "../contexts/ThemeContext";

interface NavbarProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export default function Navbar({ sidebarOpen, onToggleSidebar }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center px-4 gap-3 transition-all duration-300 ${
        scrolled
          ? "bg-[oklch(0.10_0.012_260/0.95)] backdrop-blur-xl border-b border-white/8 shadow-lg shadow-black/30"
          : "bg-[oklch(0.10_0.012_260/0.80)] backdrop-blur-md border-b border-white/5"
      } ${theme === "light" ? "bg-white/90! border-gray-200!" : ""}`}
    >
      {/* Sidebar toggle */}
      <button
        onClick={onToggleSidebar}
        className="p-2 rounded-lg hover:bg-white/10 transition-colors text-foreground/70 hover:text-foreground"
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* RUPP Logo + Brand */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 bg-primary/20 flex items-center justify-center border border-primary/30">
          <img
            src="/public/logo/rupp.svg"
            alt="RUPP Logo"
            className="w-8 h-8 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <span className="text-primary font-bold text-sm hidden">R</span>
        </div>
        <div className="min-w-0 hidden sm:block">
          <p className="text-[10px] text-muted-foreground leading-none truncate font-['Inter']">
            Royal University of Phnom Penh
          </p>
          <p className="text-sm font-bold text-electric leading-tight font-['Battambang'] text-primary">
            RC_CAR Project
          </p>
        </div>
        {/* Mobile brand */}
        <div className="sm:hidden">
          <p className="text-sm font-bold text-primary font-['Battambang']">RC_CAR</p>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Circuit scan line decoration */}
      <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-muted-foreground">
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <span>RUPP · Robotics Lab</span>
      </div>

      <div className="flex-1 hidden lg:block" />

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </motion.header>
  );
}
