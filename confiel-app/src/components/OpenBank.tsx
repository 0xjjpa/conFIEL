import { Button } from "@chakra-ui/react";
import { useState } from "react";
import { Account, BankStorage } from "../types/BankStorage";
import { CentralBankResponse } from "../types/CentralBankResponse";

export const OpenBank = ({ id, callback }: { id: string, callback: () => void}) => {
  const [isLoading, setLoading] = useState<boolean>(false);

  const openBank = async () => {
    setLoading(true);
    const response: CentralBankResponse = await (
      await fetch("/api/bank/create", {
        method: "POST",
        body: JSON.stringify({
          id,
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
    ).json();
    const { status } = response;
    if (status == "ok") {
      // We need to wait a bit of time for the ledger to sync.
      setTimeout(() => {
        callback();
        setLoading(false);
      }, 5000);
    } else {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={() => openBank()}
      isLoading={isLoading}
      size="xs"
      variant="solid"
      colorScheme="green"
      rounded="button"
    >
      Mint CBDC
    </Button>
  );
};
