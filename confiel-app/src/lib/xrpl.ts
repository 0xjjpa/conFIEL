import { EscrowCancel, EscrowCreate, EscrowFinish, Payment, TransactionMetadata } from "xrpl";

export const buildTransaction = (fromAccount: string, toAccount: string, amount = "1000"): Payment => ({
  "TransactionType": "Payment",
  "Account": fromAccount,
  "Amount": amount,
  "Destination": toAccount
})

export const buildEscrowCreate = (fromAccount: string, toAccount: string, amount = "1000", cancelAfter: number, finishAfter: number): EscrowCreate => ({
  "TransactionType": "EscrowCreate",
  "Account": fromAccount,
  "Amount": amount,
  "Destination": toAccount,
  "CancelAfter": cancelAfter,
  "FinishAfter": finishAfter
})

export const buildEscrowCancel = (fromAccount: string, sequence: number): EscrowCancel => ({
  "TransactionType": "EscrowCancel",
  "Account": fromAccount,
  "Owner": fromAccount,
  "OfferSequence": sequence,
})

export const buildEscrowFinish = (account: string, owner: string, offerSequence: number): EscrowFinish => ({
  "Account": account,
  "TransactionType": "EscrowFinish",
  "Owner": owner,
  "OfferSequence": offerSequence,
})

export const includeCondition = (escrowTransaction: EscrowCreate, condition: string): EscrowCreate => {
  escrowTransaction.Condition = condition;
  return escrowTransaction;
}

export const includeConditions = (escrowTransaction: EscrowFinish, condition: string, fulfillment: string): EscrowFinish => {
  escrowTransaction.Condition = condition;
  escrowTransaction.Fulfillment = fulfillment;
  return escrowTransaction;
}

export const includeDestinationTag = (escrowTransaction: EscrowCreate, destinationTag: number): EscrowCreate => {
  escrowTransaction.DestinationTag = destinationTag;
  return escrowTransaction;
}

export function isTransactionMetadata(meta: TransactionMetadata | string): meta is TransactionMetadata {
  return (meta as TransactionMetadata) !== undefined;
}
