import {
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
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ONBOARDING_FLOW } from "../../constants/onboarding";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { titleCase, truncate } from "../../lib/helpers";
import { BankResponse } from "../../types/BankResponse";
import { Account, BankStorage } from "../../types/BankStorage";

export const BankView = () => {
  const tableCaption = "Existing registered users and actions.";
  const [bankAddress, setBankAddress] = useState<string>("");
  const [bank, setBank] = useLocalStorage("bank", undefined);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const loadBankData = async () => {
      const addressResponse: BankResponse = await (
        await fetch("/api/bank/address")
      ).json();
      setBankAddress(addressResponse?.address);
    };
    loadBankData();
  }, []);

  const fundAccount = async (address: string) => {
    const response: BankResponse = await (
      await fetch("/api/bank/fund", {
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
      const account: Account = (bank as BankStorage)[address];
      const updatedAccount = { ...account, status: account.status + 1 };
      setBank(Object.assign({}, bank, { [address]: updatedAccount }));
    }
  };

  useEffect(() => {
    const accounts = bank ? Object.keys(bank) : [];
    setAccounts(accounts);
  }, [bank])
  
  return (
    <>
      <Text fontWeight={900}>
        Bank Account -
        <ChakraLink
          isExternal
          href={`https://testnet.xrpl.org/accounts/${bankAddress}`}
        >
          <Code>{bankAddress}</Code>
        </ChakraLink>
      </Text>
      <TableContainer>
        <Table variant="simple">
          <TableCaption>{tableCaption}</TableCaption>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Account</Th>
              <Th isNumeric>Balance</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {accounts.length > 0 ? (
              accounts.map((accountKey) => {
                const account: Account = bank[accountKey];
                return (
                  <Tr>
                    <Td>{titleCase(account.name)}</Td>
                    <Td>
                      <Code>{truncate(account.address)}</Code>
                    </Td>
                    <Td isNumeric>0.00</Td>
                    <Td>
                      {account.status ==
                        ONBOARDING_FLOW.open_account_requested && (
                        <Button onClick={() => fundAccount(account.address)}>
                          Approve
                        </Button>
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
              <Th isNumeric>Balance</Th>
              <Th>Actions</Th>
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
    </>
  );
};
