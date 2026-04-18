using NetiStock.Models;
using NetiStock.Repository;
using NetiStock.DTO;

namespace NetiStock.Services;   
public class InventoryTransactionService : IInventoryTransactionService
{
    private readonly IInventoryTransactionRepository _transactionRepo;

    public InventoryTransactionService(IInventoryTransactionRepository transactionRepo)
    {
        _transactionRepo = transactionRepo;
    }

    public async Task<IEnumerable<InventoryTransactionDto>> GetAllTransactionsAsync()
    {
        var transactions = await _transactionRepo.GetAllAsync();
        return transactions.Select(t => new InventoryTransactionDto
        {
            Id = t.Id,
            ProductId = t.ProductId,
            ProductCode = t.Product?.Code,
            ProductName = t.Product?.Name,
            TransactionType = t.TransactionType,
            Quantity = t.Quantity,
            TransactionDate = t.TransactionDate,
            ReferenceNo = t.ReferenceNo,
            PartnerName = t.PartnerName,
            Status = t.Status,
            ActionBy = t.ActionBy,
            Remark = t.Remark
        }).OrderByDescending(t => t.TransactionDate);
    }

    public async Task<InventoryTransaction> CreateTransactionAsync(InventoryTransactionDto transactionDto)
    {
        var transaction = new InventoryTransaction
        {
            ProductId = transactionDto.ProductId,
            TransactionType = transactionDto.TransactionType,
            Quantity = transactionDto.Quantity,
            ReferenceNo = transactionDto.ReferenceNo,
            PartnerName = transactionDto.PartnerName,
            Remark = transactionDto.Remark,
            ActionBy = transactionDto.ActionBy,
            Status = TransactionStatus.PENDING,
            TransactionDate = DateTime.Now
        };

        await _transactionRepo.AddAsync(transaction);
        await _transactionRepo.SaveChangesAsync();
        return transaction;
    }

    public async Task<bool> ConfirmTransactionAsync(int transactionId, string actionBy)
    {
        var transaction = await _transactionRepo.GetByIdAsync(transactionId);

        if (transaction == null) throw new Exception("ไม่พบรายการ");
        if (transaction.Status == TransactionStatus.COMPLETED) throw new Exception("รายการยืนยันไปแล้ว");
        if (transaction.Product == null) throw new Exception("ไม่พบสินค้า");

        if (transaction.TransactionType == TransactionType.WITHDRAW)
        {
            if (transaction.Product.CurrentStock < transaction.Quantity)
                throw new Exception("สต็อกไม่พอเบิก");
            transaction.Product.CurrentStock -= transaction.Quantity;
        }
        else
        {
            transaction.Product.CurrentStock += transaction.Quantity;
        }

        transaction.Status = TransactionStatus.COMPLETED;
        transaction.ActionBy = actionBy;
        await _transactionRepo.SaveChangesAsync();
        return true;
    }

    public async Task<bool> CancelTransactionAsync(int transactionId, string actionBy, string? cancelReason = null)
    {
        var transaction = await _transactionRepo.GetByIdAsync(transactionId);
        if (transaction == null) throw new Exception("ไม่พบรายการ");
        if (transaction.Status == TransactionStatus.COMPLETED) throw new Exception("รายการยืนยันไปแล้ว ไม่สามารถยกเลิกได้");
        transaction.Status = TransactionStatus.CANCELLED;
        transaction.ActionBy = actionBy;
        if (!string.IsNullOrEmpty(cancelReason))
        {
            transaction.Remark = transaction.Remark + $" [ยกเลิก: {cancelReason}]";
        }
        await _transactionRepo.SaveChangesAsync();
        return true;
    }
}