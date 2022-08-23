import { Payment, TransactionMetadata } from "xrpl";

export const buildTransaction = (fromAccount: string, toAccount: string, amount = "1000"): Payment => ({
  "TransactionType": "Payment",
  "Account": fromAccount,
  "Amount": amount,
  "Destination": toAccount
})

export function isTransactionMetadata(meta: TransactionMetadata | string): meta is TransactionMetadata {
  return (meta as TransactionMetadata) !== undefined;
}