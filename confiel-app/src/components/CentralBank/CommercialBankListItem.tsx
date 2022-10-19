import { Flex, ListItem, Text, useMediaQuery } from "@chakra-ui/react";
import { getCookie, setCookie } from "cookies-next";
import Image from "next/image";
import { useState, useEffect } from "react";
import { XRPLFaucetBank } from "../../types/XRPLFaucetResponse";
import { BankItem } from "../Bank/BankItem";
import { CommercialBankAccount } from "./CommercialBankAccount";

export const CommercialBankListItem = ({
  id,
  icon,
  name,
  longName,
  selectBank
}: {
  id: string;
  icon: { url: string; width: number; height: number };
  name: string;
  longName: string;
  selectBank: () => void;
}) => {

  const [bank, setBank] = useState<XRPLFaucetBank>();
  const uuid = `bank-${id}`;

  useEffect(() => {
    const cachedBank = getCookie(uuid);
    if (cachedBank) {
      setBank(JSON.parse(String(cachedBank)));
    }
  }, []);

  const selectBankId = (id: string) => {
    setCookie('bank-current', id);
    selectBank();
  }

  return (
    <ListItem
      px="2"
      _hover={{
        opacity: "0.8",
        background: "rgba(0,0,0,0.1)",
        borderRadius: "5",
      }}
    >
      <Flex alignItems="center" justifyContent="space-between">
        <Flex alignItems="center" onClick={() => selectBankId(id)}>
          <BankItem bank={{ id, name, longName, icon}} />
        </Flex>
        {bank ? <CommercialBankAccount address={bank.account.address} />: <Text>Open Account.</Text>}
      </Flex>
    </ListItem>
  );
};
