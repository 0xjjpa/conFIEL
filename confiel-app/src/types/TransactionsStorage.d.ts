import { TRANSACTIONS_TYPE } from '../constants/transactions';

export type Transaction = {
  from: string,
  to: string,
  hash: string,
  type: TRANSACTIONS_TYPE
}
export type TransactionsStorage = {
  [key: transaction]: Transaction
}