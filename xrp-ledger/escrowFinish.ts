import { Client, Wallet, Payment, dropsToXrp, getBalanceChanges, TransactionMetadata, EscrowCreate, EscrowFinish } from 'xrpl'
import 'dotenv/config'
import { randomBytes } from 'crypto'
const cc = require('five-bells-condition')

async function main() {

  const buildEscrowCreate = (fromAccount: string, toAccount: string, amount = "1000", finishAfter: number): EscrowCreate => ({
    "TransactionType": "EscrowCreate",
    "Account": fromAccount,
    "Amount": amount,
    "Destination": toAccount,
    "FinishAfter": finishAfter,
  })

  const buildEscrowFinish = (account: string, owner: string, offerSequence: number): EscrowFinish => ({
    "Account": account,
    "TransactionType": "EscrowFinish",
    "Owner": owner,
    "OfferSequence": offerSequence,
  })

  const includeConditions = (escrowTransaction: EscrowFinish, condition: string, fulfillment: string): EscrowFinish => {
    escrowTransaction.Condition = condition;
    escrowTransaction.Fulfillment = fulfillment;
    return escrowTransaction;
  }

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

  const CLOSE_TIME: number = (
    await client.request({
      command: 'ledger',
      ledger_index: 'validated',
    })
  ).result.ledger.close_time

  const FIVE_MINUTES = 300

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
  console.log('Alice', aliceWallet.address, dropsToXrp(aliceResponse.result.account_data.Balance));

  const bobResponse = await client.request({
    "command": "account_info",
    "account": bobWallet.address,
    "ledger_index": "validated"
  })
  console.log('Bob', bobWallet.address, dropsToXrp(bobResponse.result.account_data.Balance));

  const prepared = await client.autofill(
    includeConditions(buildEscrowFinish(
      bobWallet.address,
      "rnAcJLjZq648DgZ9YmD9XLe8ZLzH6cjvFw",
      32395118,
    ), "A0258020BD6E6938532E62F27118D46E998A7D3E2D7D5BB4ABDD81F28A6EE86846FD6754810120", "A0228020FFD04E72172FA91216AAFC4CED41E3995E3C39CD8094B0A3EB4CCD6EC828C3E5")
  )

  const max_ledger = prepared.LastLedgerSequence
  console.log("[ Finish ] Prepared transaction instructions:", prepared)
  prepared.Fee && console.log("Transaction cost:", dropsToXrp(prepared.Fee), "XRP")
  console.log("Transaction expires after ledger:", max_ledger)

  const signed = bobWallet.sign(prepared)
  console.log("Identifying hash:", signed.hash)
  console.log("Signed blob:", signed.tx_blob)

  // Submit signed blob --------------------------------------------------------
  const tx = await client.submitAndWait(signed.tx_blob)

  // Check transaction results -------------------------------------------------
  console.log("Transaction result:", tx)
  tx.result && tx.result.meta && isTransactionMetadata(tx.result.meta) &&
    console.log("Balance changes:", JSON.stringify(getBalanceChanges(tx.result.meta), null, 2))


  // const DEFAULT_AMOUNT = 10000000
  // const prepared = await client.autofill(
  //   buildEscrowCreate(
  //     aliceWallet.address,
  //     aliceWallet.address,
  //     `${DEFAULT_AMOUNT}`,
  //     CLOSE_TIME + FIVE_MINUTES
  //   )
  // )

  // const max_ledger = prepared.LastLedgerSequence
  // console.log("Prepared transaction instructions:", prepared)
  // prepared.Fee && console.log("Transaction cost:", dropsToXrp(prepared.Fee), "XRP")
  // console.log("Transaction expires after ledger:", max_ledger)

  // const signed = aliceWallet.sign(prepared)
  // console.log("Identifying hash:", signed.hash)
  // console.log("Signed blob:", signed.tx_blob)

  // // Submit signed blob --------------------------------------------------------
  // const tx = await client.submitAndWait(signed.tx_blob)

  // // Check transaction results -------------------------------------------------
  // console.log("Transaction result:", tx)
  // tx.result && tx.result.meta && isTransactionMetadata(tx.result.meta) &&
  //   console.log("Balance changes:", JSON.stringify(getBalanceChanges(tx.result.meta), null, 2))

  // Disconnect when done (If you omit this, Node.js won't end the process)
  client.disconnect()
}

main()