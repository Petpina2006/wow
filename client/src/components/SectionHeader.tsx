import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  accent?: "blue" | "cyan" | "gold";
}

const accentBg = {
  blue: "bg-primary/15",
  cyan: "bg-cyan-400/15",
  gold: "bg-yellow-400/15",
};
const accentText = {
  blue: "text-primary",
  cyan: "text-cyan-400",
  gold: "text-yellow-400",
};
const accentBorder = {
  blue: "border-primary",
  cyan: "border-cyan-400",
  gold: "border-yellow-400",
};
const accentGlow = {
  blue: "oklch(0.62 0.22 255 / 30%)",
  cyan: "oklch(0.75 0.18 195 / 30%)",
  gold: "oklch(0.78 0.15 85 / 30%)",
};

export default function SectionHeader({
  icon: Icon,
  title,
  subtitle,
  accent = "blue",
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="mb-7"
    >
      {/* Lab module label row */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-sm border-l-2 ${accentBorder[accent]} ${accentBg[accent]}`}
          style={{ boxShadow: `0 0 8px ${accentGlow[accent]}` }}
        >
          <Icon size={13} className={accentText[accent]} />
          {subtitle && (
            <span
              className={`text-[9px] font-mono tracking-widest uppercase ${accentText[accent]}`}
            >
              {subtitle}
            </span>
          )}
        </div>
        <div
          className="flex-1 h-px"
          style={{
            background: `linear-gradient(90deg, ${accentGlow[accent]}, transparent)`,
          }}
        />
      </div>

      {/* Main title */}
      <h2
        className={`text-2xl font-bold font-['Battambang'] ${accentText[accent]}`}
      >
        {title}
      </h2>
    </motion.div>
  );
}
