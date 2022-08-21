import { btoe } from "rfc1751.js";
import { SignatureAlgorithm, Credential } from "@nodecfdi/credentials";
import { Wallet } from "xrpl";
import "buffer";

export const xrlpd = (FIEL: Credential) => {
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

  // xrpClient
  //   .request({
  //     command: "account_info",
  //     account: FIELwallet.address,
  //     ledger_index: "validated",
  //   })
  //   .then((walletResponse) => {
  //     const balance = dropsToXrp(
  //       walletResponse.result.account_data.Balance
  //     );
  //     setBalance(balance);
  //   })
  //   .catch((err) => {
  //     console.error(err);
  //     setBalance("0.00");
  //   });
};