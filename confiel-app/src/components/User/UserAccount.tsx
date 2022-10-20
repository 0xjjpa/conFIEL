import { Code, Text, Button, Flex, Link as ChakraLink } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Client, Wallet } from "xrpl";
import {
  ONBOARDING_DEFAULT_BALANCE,
  ONBOARDING_DEFAULT_STAGE,
  ONBOARDING_FLOW,
} from "../../constants/onboarding";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { truncate } from "../../lib/helpers";
import { xrpldGetBalance } from "../../lib/xrpld";
import { Account, BankStorage } from "../../types/BankStorage";

export const UserAccount = ({
  bankId,
  xrplClient,
  wallet,
  name,
}: {
  bankId: string;
  xrplClient: Client;
  wallet: Wallet;
  name: string;
}) => {
  const newAccount: Account = {
    id: bankId,
    status: ONBOARDING_DEFAULT_STAGE,
    address: wallet.address,
    name,
  };
  const [bank, setBank] = useLocalStorage(`bank`, {
    [wallet.address]: newAccount,
  });
  const [account, setAccount] = useState<Account>();
  const [balance, setBalance] = useState<string>("");

  useEffect(() => {
    const loadBalance = async () => {
      console.log(
        `🏦 Bank Module - Retrieving balance from address ${account.address}...`
      );
      const balanceResponse = await xrpldGetBalance(
        xrplClient,
        account.address
      );
      if (balanceResponse.status == "err") {
        console.log(`🏦 Bank Module - Account has yet to be funded.`);
        setBalance(balanceResponse.balance);
      } else {
        console.log(`🏦 Bank Module - Account has been funded.`);
        setBalance(balanceResponse.balance);
      }
    };
    account && loadBalance();
  }, [account]);

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
      <Flex direction="column">
        <Text>
          Status{" "}
          <Code>
            {balance == ONBOARDING_DEFAULT_BALANCE ? "Inactive" : "Active"}
          </Code>
        </Text>
        <Text>
          <ChakraLink
            isExternal
            href={`https://testnet.xrpl.org/accounts/${wallet.address}`}
          >
            Wallet <Code>{truncate(wallet.address, 30)}</Code>
          </ChakraLink>
        </Text>
        <Text>
          Balance <Code>{Number(balance).toFixed(2)}</Code> XRP
        </Text>
      </Flex>
      {account?.status === ONBOARDING_FLOW.open_account && (
        <Button mt="2" onClick={moveNextStage}>
          Open Account (15 XRP)
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
