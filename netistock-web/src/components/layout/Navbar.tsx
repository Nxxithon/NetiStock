import { motion } from "framer-motion";
import { Package, Menu } from "lucide-react";

interface NavbarProps {
  onMenuToggle: () => void;
}

export default function Navbar({ onMenuToggle }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 z-50 bg-[var(--color-background)]/80 backdrop-blur-md">
      <div className="h-full flex items-center px-4 md:px-8">
        <button 
          onClick={onMenuToggle}
          className="p-2 mr-2 show-mobile text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <Package className="w-6 h-6 text-[var(--color-primary)]" />
          <h1 className="font-display text-xl text-[var(--color-primary)] tracking-tight">
            NetiStock
          </h1>
          <span className="text-[10px] uppercase tracking-widest text-[var(--color-muted-foreground)] ml-1">
            System
          </span>
        </motion.div>
      </div>


      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-primary)]/40 to-transparent" />
    </nav>
  );
}
