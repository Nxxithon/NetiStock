using NetiStock.Models;

namespace NetiStock.Repository;

public interface IProductRepository
{
    Task<IEnumerable<Product>> GetAllProductAsync();
    Task<Product?>GetProductByIdAsync(int id);
    Task AddProductAsync(Product product);
    Task UpdateProductAsync(Product product);
    void DeleteProduct(Product product);
    Task SaveChangesAsync();
}
