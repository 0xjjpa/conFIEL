import { XRPLFaucetAccount } from "./XRPLFaucetResponse";

export type CentralBankResponse = {
  status: string;
  err?: string;
  bank?: {
    account: XRPLFaucetAccount,
    balance: number
  };

}