using NetiStock.Models;

namespace NetiStock.DTO;

public class InventoryTransactionDto
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public string? ProductCode { get; set; }
    public string? ProductName { get; set; }
    public TransactionType TransactionType { get; set; }
    public int Quantity { get; set; }
    public DateTime TransactionDate { get; set; }
    public string? ReferenceNo { get; set; }
    public string? PartnerName { get; set; }
    public TransactionStatus Status { get; set; }
    public string? ActionBy { get; set; }
    public string? Remark { get; set; }
}
