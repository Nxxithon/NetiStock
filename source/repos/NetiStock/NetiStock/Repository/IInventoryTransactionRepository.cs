using NetiStock.Models;
namespace NetiStock.Repository;

public interface IInventoryTransactionRepository
{
    Task<IEnumerable<InventoryTransaction>> GetAllAsync();
    Task<InventoryTransaction> AddAsync(InventoryTransaction transaction);
    Task<InventoryTransaction?> GetByIdAsync(int id);
    Task SaveChangesAsync();
}