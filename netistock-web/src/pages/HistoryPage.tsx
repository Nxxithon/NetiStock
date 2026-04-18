import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { History, ArrowDownToLine, ArrowUpFromLine, RefreshCw, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { getAllTransactions, confirmTransaction, cancelTransaction } from "../services/transactionService";
import type { InventoryTransaction } from "../types/transaction";
import Toast from "../components/ui/Toast";
import ConfirmDialog from "../components/ui/ConfirmDialog";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export default function HistoryPage() {
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [toast, setToast] = useState({ message: "", type: "success" as "success" | "error", isVisible: false });
  const [processingId, setProcessingId] = useState<number | null>(null);

  const [dialogState, setDialogState] = useState<{ id: number, type: "CONFIRM" | "CANCEL" } | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [checkedBy, setCheckedBy] = useState("");

  const fetchHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllTransactions();
      setTransactions(data);
    } catch (err: any) {
      console.error("Failed to fetch history:", err);
      setError("ไม่สามารถดึงข้อมูลประวัติได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };



  const handleProceedDialog = async () => {
    if (!dialogState) return;
    

    if (dialogState.type === "CONFIRM") {
      if (!receiverName.trim()) {
        setToast({ message: "กรุณาระบุชื่อผู้รับสินค้า", type: "error", isVisible: true });
        return;
      }
      setProcessingId(dialogState.id);
      const targetId = dialogState.id;
      setDialogState(null);
      try {
        await confirmTransaction(targetId, receiverName);
        setToast({ message: "อนุมัติทำรายการสำเร็จ", type: "success", isVisible: true });
        setReceiverName("");
        fetchHistory();
      } catch (err: any) {
        setToast({ message: "เกิดข้อผิดพลาดในการอนุมัติ", type: "error", isVisible: true });
      } finally {
        setProcessingId(null);
      }
      return;
    }


    if (dialogState.type === "CANCEL") {
      if (!cancelReason.trim()) {
        setToast({ message: "กรุณาระบุเหตุผลที่ยกเลิก", type: "error", isVisible: true });
        return;
      }
      
      setProcessingId(dialogState.id);
      const targetId = dialogState.id;
      setDialogState(null);
      try {
        await cancelTransaction(targetId, checkedBy || "System", cancelReason);
        setToast({ message: "ปฏิเสธ/ยกเลิกรายการสำเร็จ", type: "success", isVisible: true });
        setCancelReason("");
        setCheckedBy("");
        fetchHistory();
      } catch (err: any) {
        setToast({ message: "เกิดข้อผิดพลาดในการยกเลิก", type: "error", isVisible: true });
      } finally {
        setProcessingId(null);
      }
    }
  };

  const closeDialog = () => {
    setDialogState(null);
    setCancelReason("");
    setReceiverName("");
    setCheckedBy("");
  };

  return (
    <div className="page-transition">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-display text-3xl text-[var(--color-foreground)] flex items-center gap-3">
            <History className="w-8 h-8 text-[var(--color-primary)]" />
            ประวัติการทำรายการ
          </h2>
          <p className="text-sm text-[var(--color-muted-foreground)] mt-2">
            บันทึกประวัติการนำเข้าและเบิกออกสินค้าทั้งหมดเรียงตามเวลา
          </p>
        </div>
        
        <button
          onClick={fetchHistory}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 border border-[var(--color-border)]
                   hover:bg-[var(--color-surface-hover)] text-[var(--color-foreground)] text-sm transition-colors
                   disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          รีเฟรช
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-20 gap-4">
          <RefreshCw className="w-8 h-8 text-[var(--color-muted-foreground)] animate-spin" />
          <p className="text-[var(--color-muted-foreground)] text-sm uppercase tracking-widest">
            กำลังโหลดข้อมูล...
          </p>
        </div>
      ) : error ? (
        <div className="bg-[var(--color-destructive)]/10 border border-[var(--color-destructive)] p-6 flex items-center gap-4">
          <AlertCircle className="w-6 h-6 text-[var(--color-destructive)]" />
          <p className="text-[var(--color-destructive)] text-sm">{error}</p>
        </div>
      ) : transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20 border border-dashed border-[var(--color-border)]">
          <History className="w-12 h-12 text-[var(--color-muted-foreground)]/30 mb-4" />
          <p className="text-[var(--color-muted-foreground)] text-sm">ยังไม่มีประวัติการทำรายการ</p>
        </div>
      ) : (
        <div className="w-full overflow-x-auto border-t border-[var(--color-border)]">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
                <th className="px-6 py-4 font-normal text-[10px] uppercase tracking-widest text-[var(--color-muted-foreground)]">วัน/เวลา</th>
                <th className="px-6 py-4 font-normal text-[10px] uppercase tracking-widest text-[var(--color-muted-foreground)]">ประเภท</th>
                <th className="px-6 py-4 font-normal text-[10px] uppercase tracking-widest text-[var(--color-muted-foreground)]">รายการสินค้า</th>
                <th className="px-6 py-4 font-normal text-[10px] uppercase tracking-widest text-[var(--color-muted-foreground)]">จำนวน</th>
                <th className="px-6 py-4 font-normal text-[10px] uppercase tracking-widest text-[var(--color-muted-foreground)]">สถานะ</th>
                <th className="px-6 py-4 font-normal text-[10px] uppercase tracking-widest text-[var(--color-muted-foreground)]">อ้างอิง/ซัพพลายเออร์</th>
                <th className="px-6 py-4 font-normal text-[10px] uppercase tracking-widest text-[var(--color-muted-foreground)]">ผู้ทำรายการ</th>
              </tr>
            </thead>
            <motion.tbody
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="divide-y divide-[var(--color-border)]"
            >
              {transactions.map((tx) => {
                const isReceive = tx.transactionType === "RECEIVE";
                
                return (
                  <motion.tr
                    key={tx.id}
                    variants={itemVariants}
                    className="hover:bg-[var(--color-surface-hover)] transition-colors group"
                  >
                    <td className="px-6 py-4 text-[var(--color-muted-foreground)]">
                      {formatDate(tx.transactionDate)}
                    </td>
                    
                    <td className="px-6 py-4">
                      {isReceive ? (
                        <span className="flex items-center gap-1.5 text-[var(--color-success)] text-xs font-medium uppercase tracking-wider">
                          <ArrowDownToLine className="w-3.5 h-3.5" />
                          นำเข้า
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-[var(--color-warning)] text-xs font-medium uppercase tracking-wider">
                          <ArrowUpFromLine className="w-3.5 h-3.5" />
                          เบิกออก
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                        <span className="text-[var(--color-foreground)] font-medium">
                          {tx.productCode ? `[${tx.productCode}] ${tx.productName}` : `ID: ${tx.productId}`}
                        </span>
                    </td>

                    <td className="px-6 py-4 font-mono text-[var(--color-foreground)]">
                      {isReceive ? "+" : "-"}{tx.quantity}
                    </td>

                    <td className="px-6 py-4">
                       {tx.status === "COMPLETED" ? (
                         <span className="px-2 py-1 bg-[var(--color-success)]/10 text-[var(--color-success)] text-[10px] uppercase tracking-wider rounded-sm">
                           สำเร็จ
                         </span>
                       ) : tx.status === "PENDING" ? (
                         <span className="px-2 py-1 bg-[var(--color-border)]/50 text-[var(--color-muted-foreground)] text-[10px] uppercase tracking-wider rounded-sm">
                           รอดำเนินการ
                         </span>
                       ) : (
                         <span className="px-2 py-1 bg-[var(--color-destructive)]/10 text-[var(--color-destructive)] text-[10px] uppercase tracking-wider rounded-sm">
                           ยกเลิก/ล้มเหลว
                         </span>
                       )}
                    </td>

                    <td className="px-6 py-4">
                       <div className="flex flex-col gap-1">
                          {tx.referenceNo && (
                            <span className="text-xs text-[var(--color-muted-foreground)]">
                               <span className="opacity-50">Ref:</span> {tx.referenceNo}
                            </span>
                          )}
                          {tx.partnerName && (
                            <span className="text-xs text-[var(--color-foreground)]">
                               <span className="opacity-50 text-[var(--color-muted-foreground)]">By:</span> {tx.partnerName}
                            </span>
                          )}
                          {!tx.referenceNo && !tx.partnerName && <span className="opacity-30">-</span>}
                       </div>
                    </td>

                    <td className="px-6 py-4">
                      {tx.status === "PENDING" ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setReceiverName("");
                              setDialogState({ id: tx.id, type: "CONFIRM" });
                            }}
                            disabled={processingId === tx.id}
                            className="p-1.5 text-[var(--color-success)] bg-[var(--color-success)]/10 hover:bg-[var(--color-success)]/20 rounded-md transition-colors disabled:opacity-50"
                            title="อนุมัติ"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setCancelReason("");
                              setDialogState({ id: tx.id, type: "CANCEL" });
                            }}
                            disabled={processingId === tx.id}
                            className="p-1.5 text-[var(--color-destructive)] bg-[var(--color-destructive)]/10 hover:bg-[var(--color-destructive)]/20 rounded-md transition-colors disabled:opacity-50"
                            title="ปฏิเสธ"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-[var(--color-muted-foreground)]">
                          {tx.actionBy || "System"}
                        </span>
                      )}
                    </td>

                  </motion.tr>
                );
              })}
            </motion.tbody>
          </table>
        </div>
      )}


      <ConfirmDialog
        isOpen={dialogState !== null}
        title={(() => {
          if (!dialogState) return "";
          if (dialogState.type === "CANCEL") return "ยกเลิกเทำรายการ";
          const tx = transactions.find(t => t.id === dialogState.id);
          return tx?.transactionType === "RECEIVE" ? "ยืนยันการรับสินค้าเข้า" : "ยืนยันการเบิกสินค้าออก";
        })()}
        message={(() => {
          if (!dialogState) return "";
          if (dialogState.type === "CANCEL") return "คุณกำลังปฏิเสธการทำรายการนี้ กรุณาระบุเหตุผลด้านล่างเพื่อเก็บไว้ในประวัติ";
          const tx = transactions.find(t => t.id === dialogState.id);
          return tx?.transactionType === "RECEIVE" 
            ? "คุณกำลังจะกดยืนยันการรับสินค้าเข้าสต๊อกจริง กรุณาระบุชื่อผู้รับของเพื่อบันทึกในประวัติ" 
            : "คุณกำลังจะกดยืนยันว่ามีการเบิกสินค้าออกจริง กรุณาระบุชื่อผู้เบิกของออกเพื่อบันทึกในประวัติ";
        })()}
        confirmLabel="ยืนยันรายการ"
        variant={dialogState?.type === "CONFIRM" ? "success" : "danger"}
        onConfirm={handleProceedDialog}
        onCancel={closeDialog}
      >
        {dialogState?.type === "CONFIRM" ? (
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-widest text-[var(--color-muted-foreground)]">
              {(() => {
                const tx = transactions.find(t => t.id === dialogState.id);
                return tx?.transactionType === "RECEIVE" ? "ชื่อผู้รับสินค้า *" : "ชื่อผู้ยืนยันการเบิกสินค้า *";
              })()}
            </label>
            <input
              type="text"
              value={receiverName}
              onChange={(e) => setReceiverName(e.target.value)}
              placeholder="กรอกชื่อผู้ยินยันการทำรายการ"
              className="bg-transparent border-b border-[var(--color-border)] py-2 outline-none
                       text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)]/50
                       focus:border-[var(--color-success)] transition-colors w-full"
            />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest text-[var(--color-muted-foreground)]">เหตุผลการปฏิเสธ *</label>
              <input
                type="text"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="กรอกเหตุผลให้ครบถ้วน"
                className="bg-transparent border-b border-[var(--color-border)] py-2 outline-none
                         text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)]/50
                         focus:border-[var(--color-destructive)] transition-colors w-full"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest text-[var(--color-muted-foreground)]">ผู้ยกเลิก*</label>
              <input
                type="text"
                value={checkedBy}
                onChange={(e) => setCheckedBy(e.target.value)}
                placeholder="ระบุชื่อผู้ยกเลิก"
                className="bg-transparent border-b border-[var(--color-border)] py-2 outline-none
                         text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)]/50
                         focus:border-[var(--color-destructive)] transition-colors w-full"
              />
            </div>
          </div>
        )}
      </ConfirmDialog>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
}
