import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Loader } from "lucide-react";
import type { Product, ProductFormData } from "../../types/product";

interface ProductFormModalProps {
  isOpen: boolean;
  product: Product | null;
  onSubmit: (data: ProductFormData) => Promise<void>;
  onClose: () => void;
}

export default function ProductFormModal({
  isOpen,
  product,
  onSubmit,
  onClose,
}: ProductFormModalProps) {

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [currentStock, setCurrentStock] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const isEditMode = product !== null;


  useEffect(() => {
    if (isOpen && product) {

      setCode(product.code);
      setName(product.name);
      setDescription(product.description || "");
      setCurrentStock(product.currentStock);
    } else if (isOpen) {

      setCode("");
      setName("");
      setDescription("");
      setCurrentStock(0);
    }
  }, [isOpen, product]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim() || !name.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        code: code.trim(),
        name: name.trim(),
        description: description.trim(),
        currentStock: currentStock,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999]
                       bg-[var(--color-surface)] border border-[var(--color-border)]
                       p-8 shadow-2xl w-full max-w-lg"
          >

            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-2xl text-[var(--color-foreground)]">
                {isEditMode ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">

              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-widest text-[var(--color-muted-foreground)]">
                  รหัสสินค้า (Code) *
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="เช่น SKU-001"
                  required
                  maxLength={50}
                  className="bg-transparent border-b border-[var(--color-border)] py-3 outline-none
                           text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)]/50
                           focus:border-[var(--color-primary)] transition-colors"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-widest text-[var(--color-muted-foreground)]">
                  ชื่อสินค้า (Name) *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="เช่น เมาส์ไร้สาย"
                  required
                  maxLength={100}
                  className="bg-transparent border-b border-[var(--color-border)] py-3 outline-none
                           text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)]/50
                           focus:border-[var(--color-primary)] transition-colors"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-widest text-[var(--color-muted-foreground)]">
                  รายละเอียด (Description)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="รายละเอียดสินค้า (ไม่บังคับ)"
                  rows={3}
                  maxLength={500}
                  className="bg-transparent border border-[var(--color-border)] p-4 outline-none resize-none
                           text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)]/50
                           focus:border-[var(--color-primary)] transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-4 w-full py-4 flex items-center justify-center gap-2
                         bg-[var(--color-primary)] text-[var(--color-primary-foreground)]
                         hover:bg-[var(--color-primary-hover)]
                         uppercase tracking-widest text-xs font-medium
                         transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {isSubmitting ? "กำลังบันทึก..." : isEditMode ? "บันทึกการแก้ไข" : "เพิ่มสินค้า"}
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
