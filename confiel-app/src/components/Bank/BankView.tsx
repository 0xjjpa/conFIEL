import { CheckIcon, CopyIcon } from "@chakra-ui/icons";
import {
  Box,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Link as ChakraLink,
  Thead,
  Tr,
  Text,
  Code,
  Button,
  IconButton,
  useClipboard,
  Flex,
  useMediaQuery,
} from "@chakra-ui/react";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { Wallet } from "xrpl";
import { BANKS } from "../../constants/banks";
import { ONBOARDING_FLOW } from "../../constants/onboarding";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { titleCase, truncate } from "../../lib/helpers";
import { BankResponse } from "../../types/BankResponse";
import { Bank } from "../../types/Banks";
import { Account, BankStorage } from "../../types/BankStorage";
import { XRPLFaucetBank } from "../../types/XRPLFaucetResponse";
import { AddressExplorerLink } from "../AddressExplorerLink";
import { Balance } from "../Balance";
import { Status } from "../Status";
import { BankCopyIcon } from "./BankCopyIcon";
import { BankItem } from "./BankItem";

export const BankView = ({
  bankId,
  currentWallet,
}: {
  bankId: string;
  currentWallet: Wallet;
}) => {
  const tableCaption = "Existing registered users and actions.";
  const [bankAddress, setBankAddress] = useState<string>("");
  const [bankItem, setBankItem] = useState<Bank>();
  const [bankAccount, setBankAccount] = useState<XRPLFaucetBank>();
  const [isLargerThan1280] = useMediaQuery("(min-width: 480px)");
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [bank, setBank] = useLocalStorage(`bank`, {});

  useEffect(() => {
    const loadBankData = async () => {
      if (bankId) {
        const bank = BANKS.find((bank) => bank.id == bankId);
        setBankItem(bank);
      }
    };
    loadBankData();
  }, [bankId]);

  useEffect(() => {
    const uuid = `bank-${bankId}`;
    const cachedBank = getCookie(uuid);
    if (cachedBank) {
      const bankAccount: XRPLFaucetBank = JSON.parse(String(cachedBank));
      setBankAccount(bankAccount);
      setBankAddress(bankAccount.account.address);
    }
  }, [bankId]);

  const fundAccount = async (address: string) => {
    setLoading(true);
    const response: BankResponse = await (
      await fetch("/api/bank/fund", {
        method: "POST",
        body: JSON.stringify({
          address,
          privateKey: bankAccount.account.secret,
          bankAddress: bankAccount.account.address,
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
    ).json();
    const { status } = response;
    if (status == "ok") {
      const account: Account = (bank as BankStorage)[address];
      const updatedAccount = {
        ...account,
        status: account.status + 1,
        id: bankId,
      };
      setBank(Object.assign({}, bank, { [address]: updatedAccount }));
    }
    setLoading(false);
  };

  useEffect(() => {
    const accounts = bank ? Object.keys(bank) : [];
    const accountsWithId = accounts.filter(
      (accountKey) => !!(bank[accountKey] as Account).id
    );
    const accountsWithCurrentBank = accountsWithId.filter(
      (accountKey) => (bank[accountKey] as Account).id == bankId
    );
    setAccounts(accountsWithCurrentBank);
  }, [bank]);

  console.log("currentWallet", currentWallet);

  return (
    <>
      <Flex direction="column">
        <Flex alignItems="center">
          {bankItem && <BankItem bank={bankItem} />}
        </Flex>
        <Flex alignItems="center" justifyContent="space-between">
          <Text fontWeight={900} fontFamily="mono">
            {isLargerThan1280 ? bankAddress : truncate(bankAddress, 30)}
          </Text>
          <Flex>
            <Balance address={bankAddress} hasReload={true} />
            <AddressExplorerLink address={bankAddress} />
          </Flex>
        </Flex>
      </Flex>

      <TableContainer style={isLargerThan1280 ? {height: "200px", overflow: "scroll"} : {}}>
        <Table variant="simple" size="sm">
          <TableCaption>{tableCaption}</TableCaption>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Account</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {accounts.length > 0 ? (
              accounts.map((accountKey) => {
                const account: Account = bank[accountKey];
                return (
                  <Tr key={account.address}>
                    <Td>
                      {currentWallet?.classicAddress == account.address && (
                        <Status isAvailable={true} />
                      )}
                      {titleCase(account.name)}
                    </Td>
                    <Td>
                      <ChakraLink
                        isExternal
                        href={`https://testnet.xrpl.org/accounts/${account.address}`}
                      >
                        <Code>{truncate(account.address, 30)}</Code>
                      </ChakraLink>
                      <BankCopyIcon address={account.address} />
                    </Td>
                    <Td>
                      {account.status ==
                        ONBOARDING_FLOW.open_account_requested && (
                        <Button
                          isLoading={isLoading}
                          onClick={() => fundAccount(account.address)}
                        >
                          Approve
                        </Button>
                      )}
                      {account.status == ONBOARDING_FLOW.account_approved && (
                        <Balance address={account.address} />
                      )}
                    </Td>
                  </Tr>
                );
              })
            ) : (
              <Tr>
                <Td colSpan={3}>No users registered in the system.</Td>
              </Tr>
            )}
          </Tbody>
          <Tfoot>
            <Tr>
              <Th>Name</Th>
              <Th>Account</Th>
              <Th>Actions</Th>
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
    </>
  );
};
