import { ONBOARDING_FLOW } from "../constants/onboarding"

export type Account = {
  address: string,
  status: ONBOARDING_FLOW,
  name: string
}
export type BankStorage = {
  [key: account]: Account
}

export type BalanceResponse = {
  status: 'ok' | 'err'
  balance: string
}