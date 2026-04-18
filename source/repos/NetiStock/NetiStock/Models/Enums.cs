namespace NetiStock.Models;

public enum TransactionType
{
    RECEIVE,
    WITHDRAW
}

public enum TransactionStatus
{
    PENDING,
    COMPLETED,
    CANCELLED
}