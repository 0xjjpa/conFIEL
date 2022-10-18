export type XRPLFaucetAccount = {
  "account": {
    "xAddress": string,
    "secret": string,
    "classicAddress": string,
    "address": string
  },
}
export type XRPLFaucetResponse = {
  "account": XRPLFaucetAccount,
  "amount": number,
  "balance": number
}

export type XRPLFaucetBank = XRPLFaucetAccount & {
  "balance": number
}