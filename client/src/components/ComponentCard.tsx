/**
 * ComponentCard — schematic-style hardware component card
 * Deep Space Lab: circuit-bg, lab-module badge, no emoji
 */
import { motion } from "framer-motion";
import {
  Cpu,
  Zap,
  Radio,
  Camera,
  Battery,
  Wrench,
  CircleDot,
  Wifi,
  Eye,
  GitBranch,
  Layers,
  Monitor,
} from "lucide-react";

// Map component names to Lucide icons
function getIcon(name: string) {
  const n = name.toLowerCase();
  if (n.includes("arduino") || n.includes("esp32") || n.includes("microcontroller")) return Cpu;
  if (n.includes("motor driver") || n.includes("l298")) return Zap;
  if (n.includes("bluetooth") || n.includes("hc-05")) return Radio;
  if (n.includes("camera") || n.includes("cam")) return Camera;
  if (n.includes("battery") || n.includes("ថ្ម")) return Battery;
  if (n.includes("servo")) return Wrench;
  if (n.includes("wheel") || n.includes("motor")) return CircleDot;
  if (n.includes("wifi") || n.includes("ultrasonic") || n.includes("sensor")) return Eye;
  if (n.includes("chassis") || n.includes("frame")) return Layers;
  if (n.includes("ir sensor") || n.includes("line")) return GitBranch;
  if (n.includes("display") || n.includes("lcd")) return Monitor;
  if (n.includes("wifi")) return Wifi;
  return Cpu;
}

interface ComponentCardProps {
  name: string;
  nameKh: string;
  description: string;
  image?: string;
  emoji?: string;
  delay?: number;
}

export default function ComponentCard({
  name,
  nameKh,
  description,
  image,
  delay = 0,
}: ComponentCardProps) {
  const Icon = getIcon(name);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ y: -4 }}
      className="glass-card glow-card flex flex-col group overflow-hidden"
    >
      {/* Top bar */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 border-b border-white/6 bg-white/2">
        <span className="text-[8px] font-mono tracking-widest uppercase text-primary/60">COMPONENT</span>
      </div>

      {/* Icon area */}
      <div className="relative w-full aspect-square max-h-24 bg-white/3 flex items-center justify-center border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 circuit-bg opacity-40" />
        {image ? (
          <img
            src={image}
            alt={name}
            className="relative w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="relative flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center group-hover:bg-primary/25 transition-colors">
              <Icon size={22} className="text-primary" />
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <h3 className="text-xs font-bold text-foreground font-['Inter'] leading-tight">{name}</h3>
        <p className="text-[10px] text-primary font-['Battambang']">{nameKh}</p>
        <p className="text-[10px] text-muted-foreground font-['Hanuman'] leading-relaxed mt-auto">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
