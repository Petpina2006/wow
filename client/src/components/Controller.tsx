/**
 * Controller — virtual RC car controller with D-pad
 * Sends direction commands to parent via callback
 */
import { motion } from "framer-motion";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Square } from "lucide-react";

type Direction = "forward" | "backward" | "left" | "right" | "stop";

interface ControllerProps {
  onCommand: (dir: Direction) => void;
  activeCommand?: Direction | null;
}

const buttons: { dir: Direction; icon: React.ReactNode; label: string; gridArea: string }[] = [
  { dir: "forward", icon: <ArrowUp size={20} />, label: "ទៅមុខ", gridArea: "1/2" },
  { dir: "left", icon: <ArrowLeft size={20} />, label: "ឆ្វេង", gridArea: "2/1" },
  { dir: "stop", icon: <Square size={16} />, label: "ឈប់", gridArea: "2/2" },
  { dir: "right", icon: <ArrowRight size={20} />, label: "ស្តាំ", gridArea: "2/3" },
  { dir: "backward", icon: <ArrowDown size={20} />, label: "ថយក្រោយ", gridArea: "3/2" },
];

export default function Controller({ onCommand, activeCommand }: ControllerProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-xs text-muted-foreground font-['Battambang']">ប្រដាប់បញ្ជា</p>
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: "repeat(3, 56px)", gridTemplateRows: "repeat(3, 56px)" }}
      >
        {buttons.map(({ dir, icon, label, gridArea }) => {
          const isActive = activeCommand === dir;
          return (
            <motion.button
              key={dir}
              style={{ gridArea }}
              whileTap={{ scale: 0.92 }}
              onPointerDown={() => onCommand(dir)}
              className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center gap-0.5 border transition-all duration-150 select-none ${
                isActive
                  ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/40"
                  : dir === "stop"
                  ? "bg-red-500/20 border-red-500/40 text-red-400 hover:bg-red-500/30"
                  : "glass-card border-white/15 text-foreground hover:bg-white/10 hover:border-primary/40"
              }`}
            >
              {icon}
              <span className="text-[9px] font-['Battambang'] leading-none">{label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
