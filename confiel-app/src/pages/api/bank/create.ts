import { getCookie, setCookie } from 'cookies-next';
import 'dotenv/config'
import { NextApiResponse, NextApiRequest } from 'next'
import { DEFAULT_XRPL_API_FAUCET_URL, DEFAULT_XRPL_API_URL } from '../../../constants/xrpl';
import { CentralBankResponse } from '../../../types/CentralBankResponse';
import { XRPLFaucetAccount, XRPLFaucetBank, XRPLFaucetResponse } from '../../../types/XRPLFaucetResponse';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CentralBankResponse>
) {

  const { method, body: { id = 'bbva' } } = req;

  // if (method != 'POST') return res.status(405).json({ status: 'err', err: 'Only GET method allowed' })

  const response: XRPLFaucetResponse = await (
    await fetch(DEFAULT_XRPL_API_FAUCET_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
  ).json();

  const { account, balance } = response;
  const xprlFaucetBank = { account, balance }
  const uuid = `bank-${id}`
  setCookie(uuid, JSON.stringify(xprlFaucetBank), { req, res, maxAge: 60 * 60 * 24 });
  return res.status(200).json({ status: "ok", bank: xprlFaucetBank })
}