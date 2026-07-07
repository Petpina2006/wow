
import { motion, AnimatePresence } from "framer-motion";
import { Users, Plus, X, GraduationCap, Upload } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { nanoid } from "nanoid";
import MemberCard, { Member } from "../components/MemberCard";
import { toast } from "sonner";

const STORAGE_KEY = "rc-car-group-members";

const defaultMembers: Member[] = [
  { id: nanoid(), name: "NULL", role: "leader", photo: "" },
  { id: nanoid(), name: "NULL", role: "member", photo: "" },
  { id: nanoid(), name: "NULL", role: "member", photo: "" },
];

export default function Group() {
  const [members, setMembers] = useState<Member[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : defaultMembers;
    } catch {
      return defaultMembers;
    }
  });

  const [showForm, setShowForm] = useState(false);
  const [editMember, setEditMember] = useState<Member | null>(null);
  const [formName, setFormName] = useState("");
  const [formRole, setFormRole] = useState<"leader" | "member">("member");
  const [formPhoto, setFormPhoto] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
  }, [members]);

  const openAdd = () => {
    setEditMember(null);
    setFormName("");
    setFormRole("member");
    setFormPhoto("");
    setShowForm(true);
  };

  const openEdit = (member: Member) => {
    setEditMember(member);
    setFormName(member.name);
    setFormRole(member.role);
    setFormPhoto(member.photo || "");
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    toast.success("លុបសមាជិកបានជោគជ័យ");
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setFormPhoto(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      toast.error("សូមបញ្ចូលឈ្មោះ");
      return;
    }

    if (editMember) {
      setMembers((prev) =>
        prev.map((m) =>
          m.id === editMember.id
            ? { ...m, name: formName, role: formRole, photo: formPhoto }
            : m
        )
      );
      toast.success("កែប្រែសមាជិកបានជោគជ័យ");
    } else {
      const newMember: Member = {
        id: nanoid(),
        name: formName,
        role: formRole,
        photo: formPhoto,
      };
      setMembers((prev) => [...prev, newMember]);
      toast.success("បន្ថែមសមាជិកបានជោគជ័យ");
    }
    setShowForm(false);
  };

  const leaders = members.filter((m) => m.role === "leader");
  const regularMembers = members.filter((m) => m.role === "member");

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="relative py-12 border-b border-white/8 overflow-hidden">
        <div className="absolute inset-0 circuit-bg opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/10 to-transparent" />
        <div className="container relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="lab-module">CREW-MANIFEST</span>
            <div className="h-px flex-1 bg-gradient-to-r from-[oklch(0.78_0.15_85/40%)] to-transparent" />
          </div>
          <h1 className="text-4xl font-bold font-['Battambang'] text-foreground mb-2">
            ក្រុម ៣
          </h1>
          <p className="text-muted-foreground font-['Hanuman']">
            Group 3 — RC_CAR Project Team
          </p>
        </div>
      </div>

      <div className="container py-10 space-y-10">
        {/* Teacher Section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-xl border border-[oklch(0.78_0.15_85/35%)] bg-[oklch(0.78_0.15_85/6%)]"
        >
          <div className="absolute inset-0 circuit-bg opacity-30" />
          <div className="relative flex items-center gap-2 px-5 py-2 border-b border-[oklch(0.78_0.15_85/20%)] bg-[oklch(0.78_0.15_85/8%)]">
            <span className="text-[9px] font-mono tracking-widest uppercase text-gold">INSTRUCTOR</span>
            <GraduationCap size={11} className="text-gold" />
          </div>
          <div className="relative flex items-center gap-5 p-5">
            <div className="w-16 h-16 rounded-full bg-[oklch(0.78_0.15_85/15%)] border-2 border-[oklch(0.78_0.15_85/60%)] flex items-center justify-center flex-shrink-0">
              <GraduationCap size={28} className="text-[oklch(0.78_0.15_85)]" />
            </div>
            <div>
              <p className="text-[10px] font-mono tracking-wider uppercase text-muted-foreground mb-1">
               ​បង្រៀនដោយ / Taught by
              </p>
              <h2 className="text-2xl font-bold font-['Battambang'] text-[oklch(0.78_0.15_85)]">
                Ouk Polyvan
              </h2>
              <p className="text-sm text-muted-foreground font-['Hanuman']">
                សាស្រ្តាចារ្យ — Royal University of Phnom Penh
              </p>
            </div>
          </div>
        </motion.div>

        {/* Add Member Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-primary" />
            <h2 className="text-xl font-bold font-['Battambang'] text-foreground">
              សមាជិកក្រុម ({members.length})
            </h2>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-['Battambang'] hover:bg-primary/80 transition-colors"
          >
            <Plus size={16} />
            បន្ថែមសមាជិក
          </motion.button>
        </div>

        {/* Leaders */}
        {leaders.length > 0 && (
          <div>
            <p className="text-xs text-yellow-400 font-['Battambang'] mb-4 flex items-center gap-2">
              <span>👑</span> ប្រធានក្រុម
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <AnimatePresence>
                {leaders.map((m, i) => (
                  <MemberCard key={m.id} member={m} onEdit={openEdit} onDelete={handleDelete} delay={i * 0.1} />
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Members */}
        {regularMembers.length > 0 && (
          <div>
            <p className="text-xs text-primary font-['Battambang'] mb-4 flex items-center gap-2">
              <span>👤</span> សមាជិក
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              <AnimatePresence>
                {regularMembers.map((m, i) => (
                  <MemberCard key={m.id} member={m} onEdit={openEdit} onDelete={handleDelete} delay={i * 0.06} />
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {members.length === 0 && (
          <div className="text-center py-16">
            <Users size={48} className="text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground font-['Battambang']">មិនទាន់មានសមាជិក</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 16 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="glass-card glow-card w-full max-w-md p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold font-['Battambang'] text-foreground">
                  {editMember ? "កែប្រែសមាជិក" : "បន្ថែមសមាជិក"}
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Photo upload */}
                <div className="flex flex-col items-center gap-3">
                  <div
                    className="w-20 h-20 rounded-full bg-white/10 border-2 border-dashed border-white/20 flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors overflow-hidden"
                    onClick={() => fileRef.current?.click()}
                  >
                    {formPhoto ? (
                      <img src={formPhoto} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                      <Upload size={24} className="text-muted-foreground" />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="text-xs text-primary font-['Battambang'] hover:underline"
                  >
                    ជ្រើសរូបភាព
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </div>

                {/* Name */}
                <div>
                  <label className="text-sm font-['Battambang'] text-foreground block mb-1.5">
                    ឈ្មោះ *
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-foreground focus:outline-none focus:border-primary/50 font-['Battambang']"
                    placeholder="ឈ្មោះសមាជិក"
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="text-sm font-['Battambang'] text-foreground block mb-1.5">
                    តួនាទី
                  </label>
                  <div className="flex gap-3">
                    {(["leader", "member"] as const).map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setFormRole(role)}
                        className={`flex-1 py-2 rounded-lg text-sm font-['Battambang'] border transition-colors ${
                          formRole === role
                            ? role === "leader"
                              ? "bg-yellow-500/20 border-yellow-500/50 text-yellow-400"
                              : "bg-primary/20 border-primary/50 text-primary"
                            : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"
                        }`}
                      >
                        {role === "leader" ? "👑 មេក្រុម" : "👤 សមាជិក"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-['Battambang'] hover:bg-primary/80 transition-colors"
                >
                  {editMember ? "រក្សាទុក" : "បន្ថែម"}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
