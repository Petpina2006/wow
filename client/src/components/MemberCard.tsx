
import { motion } from "framer-motion";
import { Crown, User, Edit2, Trash2, Shield } from "lucide-react";

export interface Member {
  id: string;
  name: string;
  role: "leader" | "member";
  photo?: string;
}

interface MemberCardProps {
  member: Member;
  onEdit: (member: Member) => void;
  onDelete: (id: string) => void;
  delay?: number;
}

export default function MemberCard({
  member,
  onEdit,
  onDelete,
  delay = 0,
}: MemberCardProps) {
  const isLeader = member.role === "leader";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{
        duration: 0.3,
        delay,
        ease: [0.23, 1, 0.32, 1],
      }}
      whileHover={{ y: -4 }}
      className={`
        crew-card
        relative overflow-hidden group rounded-2xl
        border transition-all duration-300

        ${
          isLeader
            ? `
              leader
              border-2
              border-[oklch(0.78_0.15_85/50%)]
              shadow-[0_0_20px_oklch(0.78_0.15_85/10%)]
            `
            : `
              border-primary/25
              hover:border-primary/50
            `
        }
      `}
    >
      {/* Circuit background */}
      <div className="absolute inset-0 circuit-bg opacity-30" />

      {/* Top bar */}
      <div
        className={`relative flex items-center justify-between px-4 py-2 border-b ${
          isLeader
            ? "border-[oklch(0.78_0.15_85/25%)] bg-[oklch(0.78_0.15_85/8%)]"
            : "border-white/10 bg-white/[0.02]"
        }`}
      >
        <span
          className={`text-[9px] font-mono tracking-widest uppercase ${
            isLeader ? "text-gold" : "text-primary"
          }`}
        >
          {isLeader ? "CREW-LEAD" : "CREW-MBR"}
        </span>

        {isLeader ? (
          <Crown size={12} className="text-gold" />
        ) : (
          <Shield size={12} className="text-primary/60" />
        )}
      </div>

      {/* Content */}
      <div className="relative p-4 flex flex-col items-center gap-3">
        {/* Avatar */}
        <div
          className={`rounded-full overflow-hidden flex items-center justify-center bg-white/8 border-2 ${
            isLeader
              ? "w-20 h-20 border-[oklch(0.78_0.15_85/60%)]"
              : "w-16 h-16 border-primary/40"
          }`}
        >
          {member.photo ? (
            <img
              src={member.photo}
              alt={member.name}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          ) : (
            <User
              size={isLeader ? 32 : 24}
              className="text-muted-foreground"
            />
          )}
        </div>

        {/* Name */}
        <p
          className={`font-bold font-['Battambang'] text-center leading-tight ${
            isLeader
              ? "text-base text-gold"
              : "text-sm text-foreground"
          }`}
        >
          {member.name}
        </p>

        {/* Role Badge */}
        <span
          className={`px-2.5 py-0.5 rounded text-[10px] font-medium font-['Battambang'] ${
            isLeader
              ? "bg-[oklch(0.78_0.15_85/15%)] text-gold border border-[oklch(0.78_0.15_85/35%)]"
              : "bg-primary/12 text-primary border border-primary/25"
          }`}
        >
          {isLeader ? "👑 មេក្រុម" : "👤 សមាជិក"}
        </span>

        {/* Actions */}
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(member)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Edit2 size={13} />
          </button>

          <button
            onClick={() => onDelete(member.id)}
            className="p-1.5 rounded-lg hover:bg-red-500/20 text-muted-foreground hover:text-red-400 transition-colors"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
