import { RepeatIcon } from "@chakra-ui/icons";
import { Flex, Skeleton, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { BankResponse } from "../types/BankResponse";

export const Balance = ({
  address,
  hasReload = false,
}: {
  address: string;
  hasReload?: boolean;
}) => {
  const [balance, setBalance] = useState<string>();
  const [isLoading, setLoading] = useState<boolean>(false);
  const loadBalance = async () => {
    if (address.length == 0) return;
    setLoading(true);
    const response: BankResponse = await (
      await fetch("/api/bank/balance", {
        method: "POST",
        body: JSON.stringify({ address }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
    ).json();
    const { status } = response;
    if (status == "ok") {
      const balance = Number(response.balance)
      isNaN(balance) ? setBalance("0.00") : setBalance(balance.toFixed(2));
    }
    setTimeout(() => setLoading(false), 1000);
  };
  useEffect(() => {
    loadBalance();
  }, [address]);
  return (
    <Skeleton isLoaded={!isLoading}>
      <Flex alignItems="center">
        {hasReload && <RepeatIcon mr="2" onClick={loadBalance} />}
        <Text fontFamily="mono">{balance}</Text>
      </Flex>
    </Skeleton>
  );
};
