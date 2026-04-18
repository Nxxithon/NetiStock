import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "danger" | "success";
  children?: React.ReactNode;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = "ยืนยัน",
  onConfirm,
  onCancel,
  variant = "danger",
  children
}: ConfirmDialogProps) {
  const isDanger = variant === "danger";

  return (
    <AnimatePresence>
      {isOpen && (
        <>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999]
                       bg-[var(--color-surface)] border border-[var(--color-border)]
                       p-8 shadow-2xl w-full max-w-md"
          >

            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-full ${isDanger ? "bg-[var(--color-danger)]/10" : "bg-[var(--color-success)]/10"}`}>
                {isDanger ? (
                  <AlertTriangle className="w-5 h-5 text-[var(--color-danger)]" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-[var(--color-success)]" />
                )}
              </div>
              <h3 className="font-display text-lg text-[var(--color-foreground)]">
                {title}
              </h3>
            </div>

            <p className="text-sm text-[var(--color-muted-foreground)] mb-6 leading-relaxed">
              {message}
            </p>

            {children && <div className="mb-8">{children}</div>}

            <div className="flex justify-end gap-3">
              <button
                onClick={onCancel}
                className="px-6 py-2.5 text-xs uppercase tracking-widest
                         border border-[var(--color-border)] text-[var(--color-muted-foreground)]
                         hover:border-[var(--color-foreground)] hover:text-[var(--color-foreground)]
                         transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={onConfirm}
                className={`px-6 py-2.5 text-xs uppercase tracking-widest text-white transition-opacity hover:opacity-90 
                         ${isDanger ? "bg-[var(--color-danger)]" : "bg-[var(--color-success)]"}`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
