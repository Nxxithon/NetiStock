import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Package, RefreshCw, AlertCircle } from "lucide-react";
import { getAllProducts, createProduct, updateProduct, deleteProduct } from "../services/productService";
import type { Product, ProductFormData } from "../types/product";
import ProductFormModal from "../components/product/ProductFormModal";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import Toast from "../components/ui/Toast";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "success" as "success" | "error" | "info", isVisible: false });
  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ message, type, isVisible: true });
  };

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError("ไม่สามารถดึงข้อมูลสินค้าได้ กรุณาตรวจสอบการเชื่อมต่อ Backend");
    } finally {
      setIsLoading(false);
    }
  }, []);


  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: ProductFormData) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, data);
        showToast(`แก้ไขสินค้า "${data.name}" สำเร็จ`, "success");
      } else {
        await createProduct(data);
        showToast(`เพิ่มสินค้า "${data.name}" สำเร็จ`, "success");
      }
      setIsFormOpen(false);
      fetchProducts();
    } catch (err) {
      console.error("Failed to save product:", err);
      showToast("เกิดข้อผิดพลาดในการบันทึก กรุณาลองใหม่", "error");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      await deleteProduct(deleteTarget.id);
      showToast(`ลบสินค้า "${deleteTarget.name}" สำเร็จ`, "success");
      setDeleteTarget(null);
      fetchProducts();
    } catch (err) {
      console.error("Failed to delete product:", err);
      showToast("เกิดข้อผิดพลาดในการลบ กรุณาลองใหม่", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="page-transition">

      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-display text-3xl text-[var(--color-foreground)]">
            สินค้าทั้งหมด
          </h2>
          <p className="text-sm text-[var(--color-muted-foreground)] mt-1">
            จัดการรายการสินค้าในคลัง
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-6 py-3
                   bg-[var(--color-primary)] text-[var(--color-primary-foreground)]
                   hover:bg-[var(--color-primary-hover)]
                   uppercase tracking-widest text-xs font-medium
                   transition-colors"
        >
          <Plus className="w-4 h-4" />
          เพิ่มสินค้า
        </button>
      </div>

      <div className="flex justify-end mb-4">
        <button
          onClick={fetchProducts}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 text-xs
                   text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]
                   transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          รีเฟรช
        </button>
      </div>


      {error && (
        <div className="flex items-center gap-3 p-4 mb-6
                      bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/30">
          <AlertCircle className="w-5 h-5 text-[var(--color-danger)] shrink-0" />
          <p className="text-sm text-[var(--color-danger)]">{error}</p>
        </div>
      )}

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20">
          <RefreshCw className="w-8 h-8 text-[var(--color-primary)] animate-spin mb-4" />
          <p className="text-sm text-[var(--color-muted-foreground)]">
            กำลังโหลดข้อมูล...
          </p>
        </div>
      )}

      {!isLoading && !error && products.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-[var(--color-border)]">
          <Package className="w-12 h-12 text-[var(--color-muted-foreground)] mb-4" />
          <p className="text-[var(--color-muted-foreground)] mb-2">
            ยังไม่มีสินค้าในระบบ
          </p>
          <button
            onClick={handleOpenAdd}
            className="text-sm text-[var(--color-primary)] hover:underline"
          >
            เพิ่มสินค้าตัวแรก →
          </button>
        </div>
      )}

      {!isLoading && !error && products.length > 0 && (
        <div className="border border-[var(--color-border)] overflow-x-auto">
          <table className="w-full whitespace-nowrap">

            <thead>
              <tr className="bg-[var(--color-surface)] border-b border-[var(--color-border)]">
                <th className="text-left px-6 py-4 text-xs uppercase tracking-widest text-[var(--color-muted-foreground)] font-medium">
                  รหัส
                </th>
                <th className="text-left px-6 py-4 text-xs uppercase tracking-widest text-[var(--color-muted-foreground)] font-medium">
                  ชื่อสินค้า
                </th>
                <th className="text-left px-6 py-4 text-xs uppercase tracking-widest text-[var(--color-muted-foreground)] font-medium">
                  รายละเอียด
                </th>
                <th className="text-right px-6 py-4 text-xs uppercase tracking-widest text-[var(--color-muted-foreground)] font-medium">
                  สต็อก
                </th>
                <th className="text-center px-6 py-4 text-xs uppercase tracking-widest text-[var(--color-muted-foreground)] font-medium">
                  จัดการ
                </th>
              </tr>
            </thead>

            <motion.tbody
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {products.map((product) => (
                <motion.tr
                  key={product.id}
                  variants={rowVariants}
                  className="border-b border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] transition-colors"
                >

                  <td className="px-6 py-4">
                    <span className="text-xs font-mono text-[var(--color-primary)]">
                      {product.code}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-[var(--color-foreground)]">
                      {product.name}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span className="text-sm text-[var(--color-muted-foreground)] line-clamp-1">
                      {product.description || "-"}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <span
                      className={`text-sm font-medium ${
                        product.currentStock === 0
                          ? "text-[var(--color-danger)]"
                          : product.currentStock <= 10
                          ? "text-[var(--color-warning)]"
                          : "text-[var(--color-success)]"
                      }`}
                    >
                      {product.currentStock}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(product)}
                        title="แก้ไข"
                        className="p-2 text-[var(--color-muted-foreground)]
                                 hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10
                                 transition-colors rounded-sm"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setDeleteTarget(product)}
                        title="ลบ"
                        className="p-2 text-[var(--color-muted-foreground)]
                                 hover:text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10
                                 transition-colors rounded-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </div>
      )}

      <ProductFormModal
        isOpen={isFormOpen}
        product={editingProduct}
        onSubmit={handleFormSubmit}
        onClose={() => setIsFormOpen(false)}
      />

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title="ยืนยันการลบสินค้า"
        message={`คุณต้องการลบสินค้า "${deleteTarget?.name}" ออกจากระบบหรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้`}
        confirmLabel={isDeleting ? "กำลังลบ..." : "ลบสินค้า"}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
}