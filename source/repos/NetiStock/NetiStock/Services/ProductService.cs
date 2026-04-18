using NetiStock.DTO;
using NetiStock.Models;
using NetiStock.Repository;

namespace NetiStock.Services;

public class ProductService : IProductService
{
    private readonly IProductRepository _repository;
    public ProductService(IProductRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<ProductDto>> GetAllProductsAsync()
    {
        var products = await _repository.GetAllProductAsync();

        return products.Select(p => new ProductDto
        {
            Id = p.Id,
            Code = p.Code,
            Name = p.Name,
            Description = p.Description,
            CurrentStock = p.CurrentStock
        });
    }

    public async Task<ProductDto?> GetProductByIdAsync(int id)
    {
        var products = await _repository.GetProductByIdAsync(id);

        if (products == null) return null;

        return new ProductDto
        {
            Id = products.Id,
            Code = products.Code,
            Name = products.Name,
            Description = products.Description,
            CurrentStock = products.CurrentStock
        };
    }

    public async Task AddProductAsync(ProductDto productDto)
    {
        var newProduct = new Product
        {
            Id = productDto.Id,
            Code = productDto.Code,
            Name = productDto.Name,
            Description = productDto.Description,
            CurrentStock = productDto.CurrentStock
        };
        await _repository.AddProductAsync(newProduct);
        await _repository.SaveChangesAsync();
    }

    public async Task UpdateProductAsync(int id, ProductDto productDto)
    {
        var oldProduct = await _repository.GetProductByIdAsync(id);

        if (oldProduct != null)
        {
            oldProduct.Code = productDto.Code;
            oldProduct.Name = productDto.Name;
            oldProduct.Description = productDto.Description;
            oldProduct.UpdatedAt = DateTime.Now;

            await _repository.UpdateProductAsync(oldProduct);
            await _repository.SaveChangesAsync();
        }
    }

    public async Task DeleteProductAsync(int id)
    {
        var product = await _repository.GetProductByIdAsync(id);
        if(product != null)
        {
            _repository.DeleteProduct(product);
            await _repository.SaveChangesAsync();
        }
    }
}