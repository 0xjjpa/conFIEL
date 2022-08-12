import { Client, Wallet, Payment, dropsToXrp, getBalanceChanges, TransactionMetadata } from 'xrpl'
import 'dotenv/config'

async function main() {

  const buildTransaction = (fromAccount: string, toAccount: string, amount = "1000"): Payment => ({
    "TransactionType": "Payment",
    "Account": fromAccount,
    "Amount": amount,
    "Destination": toAccount
  })

  function isTransactionMetadata(meta: TransactionMetadata | string): meta is TransactionMetadata {
    return (meta as TransactionMetadata) !== undefined;
  }

  // Define the network client
  const client = new Client("wss://s.altnet.rippletest.net:51233")
  await client.connect()

  const aliceSeed = process.env.XRP_SECRET_ALICE;
  if (!aliceSeed) {
    console.error("No seed for Alice");
    return;
  }
  const aliceWallet = Wallet.fromSeed(aliceSeed);

  const bobSeed = process.env.XRP_SECRET_BOB;
  if (!bobSeed) {
    console.error("No seed for Bob");
    return;
  }
  const bobWallet = Wallet.fromSeed(bobSeed);

  const aliceResponse = await client.request({
    "command": "account_info",
    "account": aliceWallet.address,
    "ledger_index": "validated"
  })
  console.log('Alice Balance', aliceResponse);

  const bobResponse = await client.request({
    "command": "account_info",
    "account": bobWallet.address,
    "ledger_index": "validated"
  })
  console.log('Bob Balance', bobResponse);

  const DEFAULT_AMOUNT = 1000
  const prepared = await client.autofill(
    buildTransaction(
      aliceWallet.address,
      bobWallet.address,
      `${DEFAULT_AMOUNT}`
      )
  )
  const max_ledger = prepared.LastLedgerSequence
  console.log("Prepared transaction instructions:", prepared)
  prepared.Fee && console.log("Transaction cost:", dropsToXrp(prepared.Fee), "XRP")
  console.log("Transaction expires after ledger:", max_ledger)

  const signed = aliceWallet.sign(prepared)
  console.log("Identifying hash:", signed.hash)
  console.log("Signed blob:", signed.tx_blob)

  // Submit signed blob --------------------------------------------------------
  const tx = await client.submitAndWait(signed.tx_blob)

  // Check transaction results -------------------------------------------------
  console.log("Transaction result:", tx)
  tx.result && tx.result.meta && isTransactionMetadata(tx.result.meta) &&
    console.log("Balance changes:", JSON.stringify(getBalanceChanges(tx.result.meta), null, 2))

  // Disconnect when done (If you omit this, Node.js won't end the process)
  client.disconnect()
}

main()