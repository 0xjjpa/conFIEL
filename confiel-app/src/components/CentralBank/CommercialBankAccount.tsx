import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { Text } from "@chakra-ui/react";
import { XRPLFaucetBank } from "../../types/XRPLFaucetResponse";

export const CommercialBankAccount = ({ id }: { id: string }) => {
  const [bank, setBank] = useState<XRPLFaucetBank>();
  const uuid = `bank-${id}`;
  useEffect(() => {
    const cachedBank = getCookie(uuid);
    if (cachedBank) {
      setBank(JSON.parse(String(cachedBank)));
    }
  }, []);
  const component = bank ? <Text> Has Bank </Text> : <Text>Issue CBDC</Text>
  return component;
};
