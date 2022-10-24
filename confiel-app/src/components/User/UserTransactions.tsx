import { RepeatIcon } from "@chakra-ui/icons";
import {
  Button,
  Box,
  Code,
  Flex,
  Status,
  Table,
  TableCaption,
  TableContainer,
  Tag,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
  useMediaQuery,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { ONBOARDING_FLOW } from "../../constants/onboarding";
import { TRANSACTIONS_TYPE } from "../../constants/transactions";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { titleCase, truncate } from "../../lib/helpers";
import { Account } from "../../types/BankStorage";
import { Transaction } from "../../types/TransactionsStorage";
import { Balance } from "../Balance";
import { BankCopyIcon } from "../Bank/BankCopyIcon";

export const UserTransactions = ({
  reloadTransactions,
  transactions,
}: {
  reloadTransactions: () => void;
  transactions: Transaction[];
}) => {
  const tableCaption = "Bank and user transactions.";
  const [isLargerThan1280] = useMediaQuery("(min-width: 480px)");
  return (
    <Box mt="5">
      <Flex alignItems="center">
        {/* Identify how to actually reload local storage. */}
        {/* <RepeatIcon mr="2" onClick={reloadTransactions} /> */}
        <Text fontWeight="bold">Transactions</Text>
      </Flex>
      <TableContainer
        style={isLargerThan1280 ? { height: "200px", overflow: "scroll" } : {}}
      >
        <Table variant="simple" size="sm">
          <TableCaption>{tableCaption}</TableCaption>
          <Thead>
            <Tr>
              <Th>From</Th>
              <Th>To</Th>
              <Th>Type</Th>
              <Th>Tx</Th>
            </Tr>
          </Thead>
          <Tbody>
            {transactions.length > 0 ? (
              transactions.map((tx) => {
                return (
                  <Tr key={tx.hash}>
                    <Td>
                      <ChakraLink
                        isExternal
                        href={`https://testnet.xrpl.org/accounts/${tx.from}`}
                      >
                        <Code>{truncate(tx.from, 30)}</Code>
                      </ChakraLink>
                      <BankCopyIcon address={tx.from} />
                    </Td>
                    <Td>
                      <ChakraLink
                        isExternal
                        href={`https://testnet.xrpl.org/accounts/${tx.to}`}
                      >
                        <Code>{truncate(tx.to, 30)}</Code>
                      </ChakraLink>
                      <BankCopyIcon address={tx.to} />
                    </Td>
                    <Td>{titleCase(TRANSACTIONS_TYPE[tx.type])}</Td>
                    <Td>
                      <ChakraLink
                        isExternal
                        href={`https://testnet.xrpl.org/transactions/${tx.hash}`}
                      >
                        <Code>{truncate(tx.hash, 60)}</Code>
                      </ChakraLink>
                      <BankCopyIcon address={tx.hash} />
                    </Td>
                  </Tr>
                );
              })
            ) : (
              <Tr>
                <Td colSpan={3}>No transactions registered in the system.</Td>
              </Tr>
            )}
          </Tbody>
          <Tfoot>
            <Tr>
              <Th>From</Th>
              <Th>To</Th>
              <Th>Type</Th>
              <Th>Tx</Th>
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
    </Box>
  );
};
