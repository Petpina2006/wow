import { motion } from "framer-motion";
import { ReactNode } from "react";
import { useIsMobile } from "../hooks/useMobile";

interface PageLayoutProps {
  children: ReactNode;
  sidebarOpen: boolean;
}

export default function PageLayout({ children, sidebarOpen }: PageLayoutProps) {
  const isMobile = useIsMobile();
  const marginLeft = isMobile ? 0 : sidebarOpen ? 240 : 64;

  return (
    <motion.main
      animate={{ marginLeft }}
      transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
      className="min-h-screen pt-16"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      >
        {children}
      </motion.div>
    </motion.main>
  );
}
