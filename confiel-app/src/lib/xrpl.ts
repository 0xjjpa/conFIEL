import { EscrowCreate, Payment, TransactionMetadata } from "xrpl";

export const buildTransaction = (fromAccount: string, toAccount: string, amount = "1000"): Payment => ({
  "TransactionType": "Payment",
  "Account": fromAccount,
  "Amount": amount,
  "Destination": toAccount
})

export const buildEscrowCreate = (fromAccount: string, toAccount: string, amount = "1000", cancelAfter: number): EscrowCreate => ({
  "TransactionType": "EscrowCreate",
  "Account": fromAccount,
  "Amount": amount,
  "Destination": toAccount,
  "CancelAfter": cancelAfter,
})

export const includeCondition = (escrowTransaction: EscrowCreate, condition: string): EscrowCreate => {
  escrowTransaction.Condition = condition;
  return escrowTransaction;
}

export const includeDestinationTag = (escrowTransaction: EscrowCreate, destinationTag: number): EscrowCreate => {
  escrowTransaction.DestinationTag = destinationTag;
  return escrowTransaction;
}

export function isTransactionMetadata(meta: TransactionMetadata | string): meta is TransactionMetadata {
  return (meta as TransactionMetadata) !== undefined;
}
