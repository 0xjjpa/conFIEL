import { Skeleton, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { BankResponse } from "../types/BankResponse";

export const Balance = ({ address }: { address: string }) => {
  const [balance, setBalance] = useState<string>();
  const [isLoading, setLoading] = useState<boolean>(false);

  useEffect(() => {
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
        setBalance(Number(response.balance).toFixed(2));
      }
      setTimeout(() => setLoading(false), 1000);
      
    };
    loadBalance();
  }, [address]);
  return (
    <Skeleton isLoaded={!isLoading}>
      <Text fontFamily="mono">{balance}</Text>
    </Skeleton>
  );
};
