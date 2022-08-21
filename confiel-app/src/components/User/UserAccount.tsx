import { Code, Text, Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Wallet } from "xrpl";
import {
  ONBOARDING_DEFAULT_STAGE,
  ONBOARDING_FLOW,
} from "../../constants/onboarding";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { Account, BankStorage } from "../../types/BankStorage";

export const UserAccount = ({
  wallet,
  name,
}: {
  wallet: Wallet;
  name: string;
}) => {
  const [bank, setBank] = useLocalStorage("bank", {
    [wallet.address]: {
      status: ONBOARDING_DEFAULT_STAGE,
      address: wallet.address,
      name,
    },
  });
  const [account, setAccount] = useState<Account>();

  useEffect(() => {
    console.log(
      `🏦 Bank Module - Bank has ${Object.keys(bank).length} accounts`
    );
    const account: Account = (bank as BankStorage)[wallet.address];
    if (!account) {
      console.log(
        `🏦 No Account Found - Creating one for ${name}:`,
        wallet.address
      );
      const newAccount = {
        status: ONBOARDING_DEFAULT_STAGE,
        address: wallet.address,
        name,
      };
      setBank(Object.assign({}, bank, { [wallet.address]: newAccount }));
      setAccount(newAccount);
    } else {
      console.log(
        `🏦 Account Found - Loading account for ${name}:`,
        account.address
      );
      setAccount(account);
    }
  }, []);

  const moveNextStage = () => {
    console.log(
      `🏦 Requesting upgrade - Requesting openning account for ${name}:`,
      account.address
    );
    const updatedAccount = { ...account, status: account.status + 1 };
    setAccount(updatedAccount);
    setBank(Object.assign({}, bank, { [wallet.address]: updatedAccount }));
  };
  return (
    <>
      <Text>
        Loaded wallet <Code>{wallet.address}</Code> with balance{" "}
        <Code>0.00 (TBD)</Code> XRP
      </Text>
      {account?.status === ONBOARDING_FLOW.open_account && (
        <Button mt="2" onClick={moveNextStage}>
          Open Account
        </Button>
      )}
      {account?.status === ONBOARDING_FLOW.open_account_requested && (
        <Text fontWeight="bold" mt="2">
          Please wait while the bank approves your account.
        </Text>
      )}
    </>
  );
};
