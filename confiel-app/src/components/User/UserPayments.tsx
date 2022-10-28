import {
  Box,
  Code,
  Flex,
  Table,
  TableCaption,
  TableContainer,
  Link as ChakraLink,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
  useMediaQuery,
} from "@chakra-ui/react";
import { Fragment, useEffect, useState } from "react";
import { TRANSACTIONS_TYPE } from "../../constants/transactions";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { truncate, titleCase } from "../../lib/helpers";
import { Escrow, EscrowStorage, Payment } from "../../types/EscrowsStorage";
import { BankCopyIcon } from "../Bank/BankCopyIcon";

export const UserPayments = ({
  rfc,
  address,
}: {
  rfc: string;
  address?: string;
}) => {
  const [escrows] = useLocalStorage(`escrows`, {});
  const [incomingPayments, setIncomingPayments] = useState<Payment[]>();
  const [outgoingPayments, setOutgoingPayments] = useState<Payment[]>();
  const [isLargerThan1280] = useMediaQuery("(min-width: 480px)");

  useEffect(() => {
    const { incomingPayments, outgoingPayments } = Object.keys(
      escrows as EscrowStorage
    ).reduce(
      (
        {
          incomingPayments,
          outgoingPayments,
        },
        escrowKey
      ) => {
        const escrow: Escrow = escrows[escrowKey];
        const { payment } = escrow;
        console.log("PAYMENT", address);
        if (escrow.payment.rfc === rfc) {
          incomingPayments.push(payment);
        }
        if (escrow.payment.from === address) {
          outgoingPayments.push(payment);
        }
        return { incomingPayments, outgoingPayments };
      },
      { incomingPayments: [], outgoingPayments: [] }
    );
    setIncomingPayments(incomingPayments);
    setOutgoingPayments(outgoingPayments);
  }, [escrows, rfc, address]);

  return (
    <Box mt="2">
      {[
        {
          label: "Incoming",
          data: incomingPayments,
        },
        {
          label: "Outgoing",
          data: outgoingPayments,
        },
      ].map((paymentsTable) => (
        <Fragment key={paymentsTable.label}>
          <Flex alignItems="center">
            <Text fontWeight="bold">{paymentsTable.label} Payments</Text>
          </Flex>
          <TableContainer
            style={
              isLargerThan1280 ? { height: "100px", overflow: "scroll" } : {}
            }
          >
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th>{paymentsTable.label == "Incoming" ? "From" : "To"}</Th>
                  <Th>Amount</Th>
                </Tr>
              </Thead>
              <Tbody>
                {paymentsTable.data?.length > 0 ? (
                  paymentsTable.data.map((payment) => {
                    return (
                      <Tr key={payment.id}>
                        <Td>
                          <Code>{paymentsTable.label == "Incoming" ? payment.from : payment.rfc }</Code>
                        </Td>
                        <Td>
                          <Code>{payment.value}</Code>
                        </Td>
                      </Tr>
                    );
                  })
                ) : (
                  <Tr>
                    <Td colSpan={3}>No items registered in the system.</Td>
                  </Tr>
                )}
              </Tbody>
              <Tfoot>
                <Tr>
                  <Th>From</Th>
                  <Th>Amount</Th>
                </Tr>
              </Tfoot>
            </Table>
          </TableContainer>
        </Fragment>
      ))}
    </Box>
  );
};
