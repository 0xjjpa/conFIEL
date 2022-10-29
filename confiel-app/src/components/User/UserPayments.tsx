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
  Button,
} from "@chakra-ui/react";
import { Fragment, useEffect, useState } from "react";
import { dropsToXrp } from "xrpl";
import { TRANSACTIONS_TYPE } from "../../constants/transactions";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { truncate, titleCase } from "../../lib/helpers";
import { Escrow, EscrowStorage, Payment } from "../../types/EscrowsStorage";
import { BankCopyIcon } from "../Bank/BankCopyIcon";

export const UserPayments = ({
  claimPayment,
  cancelPayment,
  rfc,
  address,
}: {
  claimPayment: (
    from: string,
    offerSequence: number,
    condition: string,
    fulfillment: string
  ) => void;
  cancelPayment: (offerSequence: number) => void;
  rfc: string;
  address?: string;
}) => {
  const [escrows] = useLocalStorage(`escrows`, {});
  const [incomingPayments, setIncomingPayments] = useState<Payment[]>();
  const [outgoingPayments, setOutgoingPayments] = useState<Payment[]>();
  const [isLargerThan1280] = useMediaQuery("(min-width: 480px)");
  const [isLoadingCancel, setLoadingCancel] = useState(false);
  const [isLoadingClaim, setLoadingClaim] = useState(false);

  const submitPaymentCancel = async (offerSequence: number) => {
    console.log("Loading Cancel...");
    setLoadingCancel(true);
    await cancelPayment(offerSequence);
    setLoadingCancel(false);
  };

  const submitPaymentClaim = async (
    from: string,
    to: string,
    offerSequence: number,
    condition: string,
    fulfillmet: string
  ) => {
    console.log("Loading Claim...");
    setLoadingClaim(true);
    await claimPayment(from, offerSequence, condition, fulfillmet);
    setLoadingClaim(false);
  };

  useEffect(() => {
    const { incomingPayments, outgoingPayments } = Object.keys(
      escrows as EscrowStorage
    ).reduce(
      ({ incomingPayments, outgoingPayments }, escrowKey) => {
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
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {paymentsTable.data?.length > 0 ? (
                  paymentsTable.data.map((payment) => {
                    return (
                      <Tr key={payment.id}>
                        <Td>
                          <Code>
                            {paymentsTable.label == "Incoming"
                              ? payment.from
                              : payment.rfc}
                          </Code>
                        </Td>
                        <Td>
                          <Code>{dropsToXrp(payment.value)}</Code>
                        </Td>
                        <Td>
                          {paymentsTable.label == "Incoming" ? (
                            <Button
                              isLoading={isLoadingClaim}
                              size="xs"
                              onClick={() =>
                                submitPaymentClaim(
                                  payment.from,
                                  payment.to,
                                  payment.offerSequence,
                                  payment.condition,
                                  payment.fulfillment
                                )
                              }
                            >
                              Claim
                            </Button>
                          ) : (
                            <Button
                              isLoading={isLoadingCancel}
                              size="xs"
                              onClick={() =>
                                submitPaymentCancel(payment.offerSequence)
                              }
                            >
                              Cancel
                            </Button>
                          )}
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
                  <Th>Actions</Th>
                </Tr>
              </Tfoot>
            </Table>
          </TableContainer>
        </Fragment>
      ))}
    </Box>
  );
};
