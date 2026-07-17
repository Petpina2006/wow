import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Car,
  Radio,
  Video,
  GitBranch,
  Users,
  ChevronRight,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useIsMobile } from "../hooks/useMobile";

interface SidebarProps {
  open: boolean;
  onClose?: () => void;
}

const navItems = [
  {
    path: "/",
    icon: Home,
    label: "ទំព័រដើម",
    labelEn: "Home",
  },
  {
    path: "/normal-car",
    icon: Car,
    label: "រថយន្ត RC ធម្មតា",
    labelEn: "Normal Car",
  },
  {
    path: "/ultrasonic-car",
    icon: Radio,
    label: "RC + Ultrasonic",
    labelEn: "Ultrasonic Car",
  },
  {
    path: "/streaming-car",
    icon: Video,
    label: "RC Streaming",
    labelEn: "RC Streaming",
  },
  {
    path: "/line-follower",
    icon: GitBranch,
    label: "Line Follower",
    labelEn: "Line Follower",
  },
  {
    path: "/group",
    icon: Users,
    label: "ក្រុម ៣",
    labelEn: "Group 3",
  },
];

export default function Sidebar({ open, onClose }: SidebarProps) {
  const [location] = useLocation();
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={onClose}
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
              className="fixed left-0 top-0 bottom-0 z-50 w-60 flex flex-col pt-16"
              style={{
                background: "var(--sidebar)",
                borderRight: "1px solid var(--sidebar-border)",
              }}
            >
              <nav className="flex-1 py-4 overflow-y-auto">
                {navItems.map(item => {
                  const isActive = location === item.path;
                  const Icon = item.icon;
                  return (
                    <Link key={item.path} href={item.path}>
                      <div
                        onClick={onClose}
                        className={`flex items-center gap-3 mx-2 mb-1 px-3 py-3 rounded-lg cursor-pointer transition-colors ${
                          isActive
                            ? "bg-primary/20 text-primary"
                            : "text-sidebar-foreground/60 hover:bg-white/5 hover:text-sidebar-foreground"
                        }`}
                      >
                        <Icon size={18} />
                        <div>
                          <p className="text-sm font-medium font-['Battambang']">
                            {item.label}
                          </p>
                          <p className="text-[10px] text-muted-foreground font-['Inter']">
                            {item.labelEn}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    );
  }

  return (
    <motion.aside
      initial={false}
      animate={{ width: open ? 240 : 64 }}
      transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
      className="fixed left-0 top-16 bottom-0 z-40 overflow-hidden flex flex-col"
      style={{
        background: "var(--sidebar)",
        borderRight: "1px solid var(--sidebar-border)",
      }}
    >
      {/* Nav items */}
      <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden">
        {navItems.map(item => {
          const isActive = location === item.path;
          const Icon = item.icon;

          return (
            <Link key={item.path} href={item.path}>
              <motion.div
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.97 }}
                className={`relative flex items-center gap-3 mx-2 mb-1 px-3 py-2.5 rounded-lg cursor-pointer transition-colors duration-150 group ${
                  isActive
                    ? "bg-primary/20 text-primary"
                    : "text-sidebar-foreground/60 hover:bg-white/5 hover:text-sidebar-foreground"
                }`}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-primary rounded-r-full"
                  />
                )}

                {/* Icon */}
                <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                  <Icon size={18} />
                </div>

                {/* Label */}
                <AnimatePresence>
                  {open && (
                    <motion.div
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.18 }}
                      className="flex-1 min-w-0"
                    >
                      <p className="text-sm font-medium truncate font-['Battambang'] leading-tight">
                        {item.label}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate font-['Inter']">
                        {item.labelEn}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Chevron for active */}
                {open && isActive && (
                  <ChevronRight
                    size={14}
                    className="flex-shrink-0 text-primary"
                  />
                )}

                {/* Tooltip when collapsed */}
                {!open && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-popover border border-border rounded-md text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 font-['Battambang']">
                    {item.label}
                  </div>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom brand */}
      <div className="p-3 border-t border-sidebar-border">
        <AnimatePresence>
          {open ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <p className="text-[10px] text-muted-foreground font-['Inter']">
                © 2026 RUPP Robotics
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center"
            >
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
}
