import { Flex, ListItem, Text, useMediaQuery } from "@chakra-ui/react";
import { getCookie, setCookie } from "cookies-next";
import Image from "next/image";
import { useState, useEffect } from "react";
import { XRPLFaucetBank } from "../../types/XRPLFaucetResponse";
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
  const [isLargerThan1280] = useMediaQuery("(min-width: 480px)");
  const [bank, setBank] = useState<XRPLFaucetBank>();
  const uuid = `bank-${id}`;

  useEffect(() => {
    const cachedBank = getCookie(uuid);
    if (cachedBank) {
      setBank(JSON.parse(String(cachedBank)));
    }
  }, []);

  const selectAddress = (address: string) => {
    setCookie('bank-current', address);
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
        <Flex alignItems="center" onClick={() => selectAddress(bank.account.address)}>
          <Image src={icon.url} width={icon.width} height={icon.height} />
          <Text ml="2" color="black.500">
            {name}
          </Text>
          {isLargerThan1280 && (
            <Text fontSize="xs" ml="2" color="gray.600">
              {longName}
            </Text>
          )}
        </Flex>
        {bank ? <CommercialBankAccount address={bank.account.address} />: <Text>Open Account.</Text>}
      </Flex>
    </ListItem>
  );
};
