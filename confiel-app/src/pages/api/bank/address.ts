import 'dotenv/config'
import { NextApiResponse, NextApiRequest } from 'next'
import { BankResponse } from '../../../types/BankResponse';


export default async function handler(
    _req: NextApiRequest,
    res: NextApiResponse<BankResponse>
  ) {
  const address = String(process.env.BANK_XRP_PUBLIC_KEY);
  return res.status(200).json({ status: "ok", address })
}