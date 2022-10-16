import { Client, Wallet, Payment, dropsToXrp, getBalanceChanges, TransactionMetadata, EscrowCreate } from 'xrpl'
import 'dotenv/config'
import { randomBytes } from 'crypto'
const cc = require('five-bells-condition')

async function main() {

  const preimageData = randomBytes(32)
  const fulfillment = new cc.PreimageSha256()
  fulfillment.setPreimage(preimageData)

  const condition = fulfillment.getConditionBinary().toString('hex').toUpperCase()
  console.log('Condition:', condition)

  const fulfillment_hex = fulfillment.serializeBinary().toString('hex').toUpperCase()
  console.log('Fulfillment:', fulfillment_hex)

  const buildEscrowCreate = (fromAccount: string, toAccount: string, amount = "1000", finishAfter: number, cancelAfter: number): EscrowCreate => ({
    "TransactionType": "EscrowCreate",
    "Account": fromAccount,
    "Amount": amount,
    "Destination": toAccount,
    "FinishAfter": finishAfter,
    "CancelAfter": cancelAfter,
  })

  const includeCondition = (escrowTransaction: EscrowCreate, condition: string): EscrowCreate => {
    escrowTransaction.Condition = condition;
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

  const aliceResponse = await client.request({
    "command": "account_info",
    "account": aliceWallet.address,
    "ledger_index": "validated"
  })
  console.log('Alice Balance', dropsToXrp(aliceResponse.result.account_data.Balance));


  const DEFAULT_AMOUNT = 10000000
  const prepared = await client.autofill(
    includeCondition(buildEscrowCreate(
      aliceWallet.address,
      aliceWallet.address,
      `${DEFAULT_AMOUNT}`,
      CLOSE_TIME + FIVE_MINUTES,
      CLOSE_TIME + FIVE_MINUTES
    ), condition)
  )

  console.log("Prepared", prepared);
  if (prepared.Condition) {
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

  } else {

  }

  // Disconnect when done (If you omit this, Node.js won't end the process)
  client.disconnect()
}

main()