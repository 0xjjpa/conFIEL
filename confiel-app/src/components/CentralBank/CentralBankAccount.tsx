import { useState, useEffect } from "react";
import { BankResponse } from "../../types/BankResponse";
import { Code, Text } from "@chakra-ui/react";
import { getCookies } from 'cookies-next';


export const CentralBankAccount = () => {
  const [centralBankBalance, setCentralBankBalance] = useState<string>("0.00");

  useEffect(() => {
    const cookies = getCookies();
    console.log("Cookies", cookies);
    const loadBankData = async () => {
      const balanceResponse: BankResponse = await (
        await fetch("/api/bank/balance")
      ).json();
      setCentralBankBalance(balanceResponse?.balance);
    };
    loadBankData();
  }, []);
  return (
    <Text>
      Balance <Code>{Number(centralBankBalance).toFixed(2)}</Code> XRP
    </Text>
  );
};
