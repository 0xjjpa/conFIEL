import { setCookie } from 'cookies-next';
import 'dotenv/config'
import { NextApiResponse, NextApiRequest } from 'next'
import { Client } from 'xrpl';
import { DEFAULT_XRPL_API_URL } from '../../../constants/xrpl';
import { xrpldGetBalance } from '../../../lib/xrpld';
import { BankResponse } from '../../../types/BankResponse';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BankResponse>
) {

  const client = new Client(DEFAULT_XRPL_API_URL);
  await client.connect();

  const tmpBank = {
    "account": {
      "xAddress": "T7CtvxELZmCWwuJvNCyyXmbTYPoepbsBeNJdBAdwqzjozKt",
      "secret": "sngE88eD5eCqwbhGnbLfp5oBF3toK",
      "classicAddress": "rawRmq1u5wKUDTYFzXrECKAsrCYwYkR6hf",
      "address": "rawRmq1u5wKUDTYFzXrECKAsrCYwYkR6hf"
    }
  }

  setCookie('bank-1', tmpBank.account.address, { req, res, maxAge: 60 * 60 * 24 });

  client.disconnect();


  return res.status(200).json({ status: "ok" })
}