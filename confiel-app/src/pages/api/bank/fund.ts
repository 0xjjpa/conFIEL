import 'dotenv/config'
import { NextApiResponse, NextApiRequest } from 'next'
import { Client, Wallet, Payment, dropsToXrp, getBalanceChanges, TransactionMetadata } from 'xrpl'
import { DEFAULT_FUNDING_AMOUNT, RESERVE_FUNDING_AMOUNT } from '../../../constants/bank';
import { DEFAULT_XRPL_API_URL } from '../../../constants/xrpl';
import { buildTransaction, isTransactionMetadata } from '../../../lib/xrpl';
import { BankResponse } from '../../../types/BankResponse';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BankResponse>
) {

  const { method, body: { address } } = req;

  if (method != 'POST') return res.status(405).json({ status: 'err', err: 'Only GET method allowed' })

  const client = new Client(DEFAULT_XRPL_API_URL);
  await client.connect()

  const privateKey = String(process.env.BANK_XRP_SECRET_KEY);
  const bankAddress = String(process.env.BANK_XRP_PUBLIC_KEY);

  const prepared = await client.autofill(
    buildTransaction(
      bankAddress,
      `${address}`,
      `${RESERVE_FUNDING_AMOUNT + DEFAULT_FUNDING_AMOUNT}`
    )
  )
  const bankWallet = Wallet.fromSeed(privateKey);

  const signed = bankWallet.sign(prepared)
  const tx = await client.submitAndWait(signed.tx_blob)

  client.disconnect();

  return res.status(200).json({ status: "ok", txHash: tx?.result?.hash })
}