import { motion } from "framer-motion";
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Square,
} from "lucide-react";
type Direction = "forward" | "backward" | "left" | "right" | "stop";

interface ControllerProps {
  onCommand: (dir: Direction) => void;
  activeCommand?: Direction | null;
}

const buttons = [
  {
    dir: "forward" as Direction,
    icon: <ArrowUp size={20} />,
    label: "ទៅមុខ",
    gridArea: "1/2",
  },

  {
    dir: "left" as Direction,
    icon: <ArrowLeft size={20} />,
    label: "ឆ្វេង",
    gridArea: "2/1",
  },

  {
    dir: "stop" as Direction,
    icon: <Square size={16} />,
    label: "ឈប់",
    gridArea: "2/2",
  },

  {
    dir: "right" as Direction,
    icon: <ArrowRight size={20} />,
    label: "ស្តាំ",
    gridArea: "2/3",
  },

  {
    dir: "backward" as Direction,
    icon: <ArrowDown size={20} />,
    label: "ថយក្រោយ",
    gridArea: "3/2",
  },
];
export default function Controller({
  onCommand,
  activeCommand,
}: ControllerProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground font-['Battambang']">
        🎮 Control Pad
      </p>
      <div
        className="grid gap-2"
        style={{
          gridTemplateColumns: "repeat(3,56px)",
          gridTemplateRows: "repeat(3,56px)",
        }}
      >
        {buttons.map(({ dir, icon, label, gridArea }) => {
          const active = activeCommand === dir;

          return (
            <motion.button
              key={dir}

              style={{
                gridArea,
              }}

              whileTap={{
                scale: 0.9,
              }}

              onPointerDown={() => onCommand(dir)}

              onPointerUp={() => onCommand("stop")}

              onPointerLeave={() => onCommand("stop")}

              className={`
w-14
h-14
rounded-xl
flex
flex-col
items-center
justify-center
gap-1
border
select-none
transition-all

${
  active
    ? "bg-primary text-primary-foreground border-primary shadow-lg"
    : dir === "stop"
      ? "bg-red-500/20 border-red-500/40 text-red-400"
      : "glass-card border-white/15 hover:border-primary/40"
}

`}
            >
              {icon}

              <span
                className="
text-[9px]
font-['Battambang']
"
              >
                {label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
