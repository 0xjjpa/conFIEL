import 'dotenv/config'
import { NextApiResponse, NextApiRequest } from 'next'
import { Client } from 'xrpl';
import { DEFAULT_XRPL_API_URL } from '../../../constants/xrpl';
import { xrpldGetBalance } from '../../../lib/xrpld';
import { BankResponse } from '../../../types/BankResponse';


export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<BankResponse>
) {

  const client = new Client(DEFAULT_XRPL_API_URL);
  await client.connect();

  const address = String(process.env.BANK_XRP_PUBLIC_KEY);

  const balanceResponse = await xrpldGetBalance(
    client,
    address
  );

  client.disconnect();

  if (balanceResponse.status == "err") {
    return res.status(200).json({ status: "ok", err: balanceResponse.status })
  } else {
    return res.status(501).json({ status: "ok", balance: balanceResponse.balance })
  }
}