import { TRANSACTIONS_TYPE } from '../constants/transactions';

export type Payment = {
  id: string,
  from: string,
  value: string,
  to: string,
  rfc: string,
  offerSequence: number,
  condition: string,
  fulfillment: string,
  claimedTx?: string,
}

export type Escrow = {
  destinationTag: number
  payment: Payment
}

export type EscrowStorage = {
  [key: txHash]: Escrow
}