import { TRANSACTIONS_TYPE } from '../constants/transactions';

export type Payment = {
  id: string,
  from: string,
  value: string,
  to: string,
  rfc: string,
  offerSequence: number
}

export type Escrow = {
  destinationTag: number
  payment: Payment
}

export type EscrowStorage = {
  [key: condition]: Escrow
}