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
import { Account } from "../../types/BankStorage";

export const BankView = () => {
  const tableCaption = "Existing registered users and actions.";
  const [bankAddress, setBankAddress] = useState<string>("")
  const [bank] = useLocalStorage("bank", undefined);

  useEffect(() => {
    const loadBankData = async() => {
      const addressResponse: BankResponse = await (await fetch('/api/bank/address')).json()
      setBankAddress(addressResponse?.address)
    }
    loadBankData()
  }, [])

  const accounts = bank ? Object.keys(bank) : [];
  return (
    <>
    <Text fontWeight={900}>Bank Account - 
      <ChakraLink isExternal href={`https://testnet.xrpl.org/accounts/${bankAddress}`}>
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
                  <Td><Code>{truncate(account.address)}</Code></Td>
                  <Td isNumeric>0.00</Td>
                  <Td>{
                    account.status == ONBOARDING_FLOW.open_account_requested &&
                    <Button>Approve</Button>
                    }</Td>
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
