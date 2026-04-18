namespace NetiStock.Models;

public class InventoryTransaction
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public TransactionType TransactionType { get; set; }
    public int Quantity { get; set; }
    public DateTime TransactionDate { get; set; } = DateTime.Now;
    public string? ReferenceNo { get; set; }
    public string? PartnerName { get; set; }
    public TransactionStatus Status { get; set; } = TransactionStatus.PENDING;
    public string? ActionBy { get; set; }
    public string? Remark { get; set; }
    public virtual Product? Product { get; set; }
}