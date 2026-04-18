using Microsoft.AspNetCore.Mvc;
using NetiStock.DTO;
using NetiStock.Services;

namespace NetiStock.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductController : ControllerBase
{
    private readonly IProductService _productService;

    public ProductController(IProductService productService)
    {
        _productService = productService;
    }

    [HttpGet] 
    public async Task<IActionResult> GetAll()
    {
        var products = await _productService.GetAllProductsAsync();
        return Ok(products); 
    }

    [HttpGet("{id}")] 
    public async Task<IActionResult> GetById(int id)
    {
        var product = await _productService.GetProductByIdAsync(id);
        if (product == null)
        {
            return NotFound();
        }
        return Ok(product);
    }

    [HttpPost] 
    public async Task<IActionResult> Add([FromBody] ProductDto productDto) 
    {
        await _productService.AddProductAsync(productDto);
        return Ok("เพิ่มสินค้าเรียบร้อยแล้ว");
    }

    [HttpPut("{id}")] 
    public async Task<IActionResult> Update(int id, [FromBody] ProductDto productDto)
    {
        await _productService.UpdateProductAsync(id, productDto);
        return NoContent(); 
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _productService.DeleteProductAsync(id);
        return NoContent();
    }
}