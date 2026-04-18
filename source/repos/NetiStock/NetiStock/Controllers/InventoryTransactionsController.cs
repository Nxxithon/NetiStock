using Microsoft.AspNetCore.Mvc;
using NetiStock.Models;
using NetiStock.Services;
using NetiStock.DTO;

namespace NetiStock.Controllers;

[Route("api/[controller]")]
[ApiController]
public class InventoryTransactionsController : ControllerBase
{
    private readonly IInventoryTransactionService _inventoryTransactionService;

    public InventoryTransactionsController(IInventoryTransactionService inventoryTransactionService)
    {
        _inventoryTransactionService = inventoryTransactionService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var transactions = await _inventoryTransactionService.GetAllTransactionsAsync();
        return Ok(transactions);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] InventoryTransactionDto transactionDto)
    {
        var result = await _inventoryTransactionService.CreateTransactionAsync(transactionDto);
        return Ok(result);
    }

    [HttpPut("{id}/confirm")]
    public async Task<IActionResult> Confirm(int id, [FromQuery] string actionBy)
    {
        try
        {
            await _inventoryTransactionService.ConfirmTransactionAsync(id, actionBy);
            return Ok(new { message = "Confirmed and Stock Updated!" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPut("{id}/cancel")]
    public async Task<IActionResult> Cancel(int id, [FromQuery] string actionBy, [FromQuery] string? reason = null)
    {
        try
        {
            await _inventoryTransactionService.CancelTransactionAsync(id, actionBy, reason);
            return Ok(new { message = "Transaction Cancelled" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}