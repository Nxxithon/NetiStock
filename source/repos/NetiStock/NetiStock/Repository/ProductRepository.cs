using NetiStock.Data;
using NetiStock.Models;
using Microsoft.EntityFrameworkCore;

namespace NetiStock.Repository; 

public class ProductRepository : IProductRepository
{
    private readonly AppDbContext _context;

    public ProductRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Product>> GetAllProductAsync() 
        => await _context.Products.ToListAsync();

    public async Task<Product?> GetProductByIdAsync(int id)
        => await _context.Products.FindAsync(id);

    public async Task AddProductAsync(Product product)
        => await _context.Products.AddAsync(product);

    public async Task UpdateProductAsync(Product product)
    {
        _context.Products.Update(product);
        await Task.CompletedTask;
    }

    public void DeleteProduct(Product product)
        => _context.Products.Remove(product);

    public async Task SaveChangesAsync()
        => await _context.SaveChangesAsync();
}