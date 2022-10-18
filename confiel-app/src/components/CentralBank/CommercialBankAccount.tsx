import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { Flex, Text } from "@chakra-ui/react";
import { XRPLFaucetBank } from "../../types/XRPLFaucetResponse";
import { Balance } from "../Balance";
import { AddressExplorerLink } from "../AddressExplorerLink";

export const CommercialBankAccount = ({ id }: { id: string }) => {
  const [bank, setBank] = useState<XRPLFaucetBank>();
  const uuid = `bank-${id}`;
  useEffect(() => {
    const cachedBank = getCookie(uuid);
    if (cachedBank) {
      setBank(JSON.parse(String(cachedBank)));
    }
  }, []);
  console.log("Bank", bank);
  const component = bank ? (
    <Flex alignItems="center">
      <Balance address={bank.account.address} />
      <AddressExplorerLink address={bank.account.address} />
    </Flex>
  ) : (
    <Text>Issue CBDC</Text>
  );
  return component;
};
