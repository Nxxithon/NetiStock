using NetiStock.Models;
using NetiStock.DTO;

namespace NetiStock.Services;

public interface IInventoryTransactionService
{
    Task<IEnumerable<InventoryTransactionDto>> GetAllTransactionsAsync();
    Task<InventoryTransaction> CreateTransactionAsync(InventoryTransactionDto transactionDto);
    Task<bool> ConfirmTransactionAsync(int transactionId, string actionBy);
    Task<bool> CancelTransactionAsync(int transactionId, string actionBy, string? cancelReason = null);

}