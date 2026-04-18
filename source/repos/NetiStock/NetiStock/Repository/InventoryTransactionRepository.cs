using Microsoft.EntityFrameworkCore;
using NetiStock.Data;
using NetiStock.Models;
using NetiStock.Repository;

namespace NetiStock.Repositories;

public class InventoryTransactionRepository : IInventoryTransactionRepository
{
    private readonly AppDbContext _context;

    public InventoryTransactionRepository(AppDbContext context)
    {
        _context = context;
    }
    public async Task<IEnumerable<InventoryTransaction>> GetAllAsync()
    {
        return await _context.InventoryTransactions
            .Include(t => t.Product) 
            .OrderByDescending(t => t.TransactionDate)
            .ToListAsync();
    }

    public async Task<InventoryTransaction> AddAsync(InventoryTransaction transaction)
    {
        await _context.InventoryTransactions.AddAsync(transaction);
        return transaction;
    }

    public async Task<InventoryTransaction?> GetByIdAsync(int id)
    {
        return await _context.InventoryTransactions
            .Include(t => t.Product)
            .FirstOrDefaultAsync(t => t.Id == id);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}