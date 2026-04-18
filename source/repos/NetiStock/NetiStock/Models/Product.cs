namespace NetiStock.Models;

public class Product
{
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; } 
    public int CurrentStock { get; set; }
    public DateTime UpdatedAt { get; set; } = DateTime.Now;
}