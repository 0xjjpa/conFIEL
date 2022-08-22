import { btoe } from "rfc1751.js";
import { SignatureAlgorithm, Credential } from "@nodecfdi/credentials";
import { Client, dropsToXrp, Wallet } from "xrpl";
import "buffer";
import { BalanceResponse } from "../types/BankStorage";
import { ONBOARDING_DEFAULT_BALANCE } from "../constants/onboarding";

export const xrpld = (FIEL: Credential) => {
  console.log('⚙️ XRP Derivation Engine - FIEL Loading, deriving wallet...')
  const walletSeed = FIEL.sign("ConFIEL", SignatureAlgorithm.MD5);
  const encoder = new TextEncoder();
  const encodedSeed = encoder.encode(walletSeed);
  const rfc1751 = btoe(encodedSeed);
  const wallet = Wallet.fromMnemonic(rfc1751, {
    mnemonicEncoding: "rfc1751",
  });
  console.log(`⚙️ XRP Derivation Engine - Wallet found, updating with ${wallet.address}`)
  return wallet;
};

export const xrpldGetBalance = async (xrpClient: Client, address: string): Promise<BalanceResponse> => {
  return xrpClient
    .request({
      command: "account_info",
      account: address,
      ledger_index: "validated",
    })
    .then((walletResponse) => {
      const balance = dropsToXrp(
        walletResponse.result.account_data.Balance
      );
      return ({ status: 'ok', balance } as BalanceResponse);
    })
    .catch((err) => {
      console.error(err);
      return ({
        status: 'err',
        balance: ONBOARDING_DEFAULT_BALANCE
      } as BalanceResponse);
    });
}

