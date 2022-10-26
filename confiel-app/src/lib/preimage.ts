import { randomBytes } from "crypto";
const cc = require('five-bells-condition');

export type Preimage = {
  condition: string;
  fulfillment: string;
}

export const generatePreimage = (): Preimage => {
  const preimageData = randomBytes(32)
  const fulfillment = new cc.PreimageSha256()
  fulfillment.setPreimage(preimageData)
  const condition = fulfillment.getConditionBinary().toString('hex').toUpperCase()
  const fulfillment_hex = fulfillment.serializeBinary().toString('hex').toUpperCase()
  return { condition, fulfillment: fulfillment_hex }
}