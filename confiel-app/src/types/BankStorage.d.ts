import { ONBOARDING_FLOW } from "../constants/onboarding"

export type Account = {
  address: string,
  status: ONBOARDING_FLOW
}
export type BankStorage = {
  [key: account]: Account
}