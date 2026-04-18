import { useState, useEffect } from "react";
import { ArrowRightLeft, ArrowDownToLine, ArrowUpFromLine, Save, Loader, Search } from "lucide-react";
import { getAllProducts } from "../services/productService";
import { createTransaction } from "../services/transactionService";
import type { Product } from "../types/product";
import type { TransactionType, InventoryTransactionFormData } from "../types/transaction";
import Toast from "../components/ui/Toast";

export default function TransactionPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [transactionType, setTransactionType] = useState<TransactionType>("RECEIVE");
  const [selectedProductId, setSelectedProductId] = useState<number | "">("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [referenceNo, setReferenceNo] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [remark, setRemark] = useState("");
  const [actionBy, setActionBy] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "success" as "success" | "error", isVisible: false });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (err) {
        setToast({ message: "ไม่สามารถดึงรายการสินค้าได้", type: "error", isVisible: true });
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const selectedProduct = products.find(p => p.id === selectedProductId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) {
      setToast({ message: "กรุณาเลือกสินค้า", type: "error", isVisible: true });
      return;
    }
    
    const qty = Number(quantity);
    if (!qty || qty <= 0) {
      setToast({ message: "กรุณาระบุจำนวนที่ถูกต้อง", type: "error", isVisible: true });
      return;
    }

    setIsSubmitting(true);
    try {
      if (transactionType === "WITHDRAW") {
        const selectedProduct = products.find(p => p.id === selectedProductId);
        if (selectedProduct && qty > selectedProduct.currentStock) {
          setToast({ 
            message: `ไม่สามารถเบิกได้ (ในคลังมี ${selectedProduct.currentStock} แต่ขอเบิก ${qty})`, 
            type: "error", 
            isVisible: true 
          });
          setIsSubmitting(false);
          return;
        }
      }

      const formData: InventoryTransactionFormData = {
        productId: selectedProductId as number,
        transactionType,
        quantity: qty,
        referenceNo: referenceNo.trim() || undefined,
        partnerName: partnerName.trim() || undefined,
        remark: remark.trim() || undefined,
        actionBy: actionBy.trim() || "System",
      };

      await createTransaction(formData);

      setToast({ message: `สร้างรายการ ${transactionType === "RECEIVE" ? "นำเข้า" : "เบิกออก"} สำเร็จ (รอตรวจสอบ)`, type: "success", isVisible: true });
      
      setSelectedProductId("");
      setQuantity("");
      setReferenceNo("");
      setPartnerName("");
      setRemark("");
      setActionBy("");
    } catch (err: any) {
      const errMsg = err.response?.data?.error || "เกิดข้อผิดพลาดในการสร้างรายการ";
      setToast({ message: errMsg, type: "error", isVisible: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-transition max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="font-display text-3xl text-[var(--color-foreground)] flex items-center gap-3">
          <ArrowRightLeft className="w-8 h-8 text-[var(--color-primary)]" />
          รับเข้า / เบิกออกสินค้า
        </h2>
        <p className="text-sm text-[var(--color-muted-foreground)] mt-2">
          ทำรายการความเคลื่อนไหวของสต็อก (Inventory Transactions)
        </p>
      </div>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-4 md:p-8">
        <div className="responsive-grid responsive-grid-2 mb-8">
          <button
            type="button"
            onClick={() => setTransactionType("RECEIVE")}
            className={`py-4 px-6 flex flex-col items-center justify-center gap-2 border-2 transition-all
              ${transactionType === "RECEIVE" 
                ? "border-[var(--color-success)] bg-[var(--color-success)]/10 text-[var(--color-success)]" 
                : "border-[var(--color-border)] text-[var(--color-muted-foreground)] hover:border-[var(--color-muted-foreground)]"
              }`}
          >
            <ArrowDownToLine className="w-6 h-6" />
            <span className="font-medium uppercase tracking-widest text-xs">นำเข้า (Receive)</span>
          </button>
          
          <button
            type="button"
            onClick={() => setTransactionType("WITHDRAW")}
            className={`py-4 px-6 flex flex-col items-center justify-center gap-2 border-2 transition-all
              ${transactionType === "WITHDRAW" 
                ? "border-[var(--color-warning)] bg-[var(--color-warning)]/10 text-[var(--color-warning)]" 
                : "border-[var(--color-border)] text-[var(--color-muted-foreground)] hover:border-[var(--color-muted-foreground)]"
              }`}
          >
            <ArrowUpFromLine className="w-6 h-6" />
            <span className="font-medium uppercase tracking-widest text-xs">เบิกออก (Withdraw)</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-widest text-[var(--color-muted-foreground)]">
              เลือกสินค้า (Product) *
            </label>
            <div className="relative">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted-foreground)]" />
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value ? Number(e.target.value) : "")}
                disabled={isLoading}
                required
                className="w-full bg-transparent border-b border-[var(--color-border)] py-3 pl-8 outline-none
                         text-[var(--color-foreground)] cursor-pointer appearance-none
                         focus:border-[var(--color-primary)] transition-colors"
                style={{ WebkitAppearance: 'none' }}
              >
                <option value="" className="bg-[var(--color-surface)] text-[var(--color-muted-foreground)]">
                  {isLoading ? "กำลังโหลดสินค้า..." : "-- เลือกสินค้า --"}
                </option>
                {products.map(p => (
                  <option key={p.id} value={p.id} className="bg-[var(--color-surface)] text-[var(--color-foreground)]">
                    [{p.code}] {p.name} - สต็อก: {p.currentStock}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-widest text-[var(--color-muted-foreground)]">
              จำนวน (Quantity) *
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value === "" ? "" : Number(e.target.value))}
              min={1}
              required
              placeholder={transactionType === "RECEIVE" ? "ระบุจำนวนที่นำเข้า" : "ระบุจำนวนที่เบิกออก"}
              className="bg-transparent border-b border-[var(--color-border)] py-3 outline-none
                       text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)]/50
                       focus:border-[var(--color-primary)] transition-colors"
            />
            {selectedProduct && transactionType === "WITHDRAW" && (
              <p className="text-xs text-[var(--color-muted-foreground)] mt-1">
                มีสต็อกสูงสุดเบิกได้: <span className="text-[var(--color-warning)]">{selectedProduct.currentStock}</span>
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest text-[var(--color-muted-foreground)]">
                เลขอ้างอิง (Ref NO.)
              </label>
              <input
                type="text"
                value={referenceNo}
                onChange={(e) => setReferenceNo(e.target.value)}
                placeholder="กรอกเลขอ้างอิง"
                className="bg-transparent border-b border-[var(--color-border)] py-3 outline-none
                         text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)]/50
                         focus:border-[var(--color-primary)] transition-colors"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest text-[var(--color-muted-foreground)]">
                {transactionType === "RECEIVE" ? "ซัพพลายเออร์ / คู่ค้า (Supplier / Partner)" : "ผู้เบิก"}
              </label>
              <input
                type="text"
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
                placeholder={transactionType === "RECEIVE" ? "ซัพพลายเออร์" : "ผู้เบิก / แผนก"}
                className="bg-transparent border-b border-[var(--color-border)] py-3 outline-none
                         text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)]/50
                         focus:border-[var(--color-primary)] transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-widest text-[var(--color-muted-foreground)]">
              หมายเหตุ (Remark)
            </label>
            <input
              type="text"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="รายละเอียดเพิ่มเติม..."
              className="bg-transparent border-b border-[var(--color-border)] py-3 outline-none
                       text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)]/50
                       focus:border-[var(--color-primary)] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-widest text-[var(--color-muted-foreground)]">
              ผู้ยื่นคำขอ (Action By) *
            </label>
            <input
              type="text"
              value={actionBy}
              onChange={(e) => setActionBy(e.target.value)}
              required
              placeholder="กรอกชื่อผู้ยื่นรายการ"
              className="bg-transparent border-b border-[var(--color-border)] py-3 outline-none
                       text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)]/50
                       focus:border-[var(--color-primary)] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !selectedProductId}
            className={`mt-4 w-full py-4 flex items-center justify-center gap-2
                      text-white uppercase tracking-widest text-xs font-medium
                      transition-colors disabled:opacity-50
                      ${transactionType === "RECEIVE" ? "bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90" : "bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90"}`}
          >
            {isSubmitting ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSubmitting ? "กำลังสร้างรายการ..." : "สร้างรายการคำขอ (ส่งไปตรวจสอบ)"}
          </button>
        </form>
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
}
