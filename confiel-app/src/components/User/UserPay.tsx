import {
  InputGroup,
  Input,
  InputRightElement,
  Button,
  Text,
  Link as ChakraLink,
  Box,
} from "@chakra-ui/react";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { Client, Wallet } from "xrpl";
import { DEFAULT_FUNDING_AMOUNT } from "../../constants/bank";
import { TRANSACTIONS_TYPE } from "../../constants/transactions";
import { XRPL_SUCCESSFUL_TES_CODE } from "../../constants/xrpl";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { generatePreimage } from "../../lib/preimage";
import {
  buildEscrowCreate,
  includeCondition,
  includeDestinationTag,
  isTransactionMetadata,
} from "../../lib/xrpl";
import {
  Transaction,
  TransactionsStorage,
} from "../../types/TransactionsStorage";
import { XRPLFaucetBank } from "../../types/XRPLFaucetResponse";

export const UserPay = ({
  bankId,
  xrplClient,
  wallet,
}: {
  bankId: string;
  xrplClient: Client;
  wallet: Wallet;
}) => {
  const [addressToTransfer, setAddressToTransfer] = useState("");
  const [transferTx, setTransferTx] = useState("");
  const [escrowFulfillment, setEscrowFulfillment] = useState<string>();
  const [bankAddress, setBankAddress] = useState<string>("");
  const [isSuccessful, setSuccessful] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [transactions, setTransactions] = useLocalStorage(`transactions`, {});
  const handleChangeAddress = (e) => setAddressToTransfer(e.target.value);

  const escrowXRP = async () => {
    setLoading(true);
    console.log(
      `👤 User Module Found - Started escrow from ${wallet.address} to ${addressToTransfer} via ${bankAddress}`
    );

    const CLOSE_TIME: number = (
      await xrplClient.request({
        command: "ledger",
        ledger_index: "validated",
      })
    ).result.ledger.close_time;

    const FIVE_MINUTES = 300;

    const { condition, fulfillment } = generatePreimage();
    setEscrowFulfillment(fulfillment);
    console.log(
      `👤 User Module Found - Fulfillment for escrow is ${fulfillment}`
    );

    const prepared = await xrplClient.autofill(
      includeDestinationTag(
        includeCondition(
          buildEscrowCreate(
            wallet.address,
            bankAddress,
            `${DEFAULT_FUNDING_AMOUNT / 100}`,
            CLOSE_TIME + FIVE_MINUTES
          ),
          condition
        ),
        10
      ) // @TODO: Replace "10" for an actual DT
    );

    const signed = wallet.sign(prepared);
    const tx = await xrplClient.submitAndWait(signed.tx_blob);
    console.log(`👤 User Module Found - Completed escrow`, tx);
    if (isTransactionMetadata(tx.result.meta)) {
      tx.result.meta.TransactionResult == XRPL_SUCCESSFUL_TES_CODE;
      setSuccessful(true);
    }
    const transactionId = `${wallet.address}-${bankAddress}`;
    const existingTransactions: Transaction[] =
      (transactions as TransactionsStorage)[transactionId] || [];
    const newTransaction: Transaction = {
      from: wallet.address,
      to: bankAddress,
      hash: tx.result.hash,
      type: TRANSACTIONS_TYPE.payment,
    };
    existingTransactions.push(newTransaction);
    setTransactions(
      Object.assign({}, transactions, {
        [transactionId]: existingTransactions,
      })
    );
    setTransferTx(tx.result.hash);
    setLoading(false);
  };

  useEffect(() => {
    const uuid = `bank-${bankId}`;
    const cachedBank = getCookie(uuid);
    if (cachedBank) {
      const bankAccount: XRPLFaucetBank = JSON.parse(String(cachedBank));
      setBankAddress(bankAccount.account.address);
    }
  }, [bankId]);

  return (
    <>
      <InputGroup size="md">
        <Input
          pr="4.5rem"
          type="text"
          value={addressToTransfer}
          onChange={handleChangeAddress}
          placeholder="CACX7...101P8"
        />
        <InputRightElement width="4.5rem">
          <Button
            h="1.75rem"
            disabled={!(addressToTransfer.length > 0)}
            isLoading={isLoading}
            size="sm"
            onClick={() => escrowXRP()}
          >
            Enter
          </Button>
        </InputRightElement>
      </InputGroup>
      {transferTx.length > 0 && (
        <Box>
          <Text mt="2">
            Payment {isSuccessful ? "successful" : "failed"} -{" "}
            <ChakraLink
              isExternal
              href={`
          https://testnet.xrpl.org/transactions/${transferTx}`}
            >
              See Payment
            </ChakraLink>
          </Text>
          <Text fontWeight="bold">Payment code - {escrowFulfillment}</Text>
        </Box>
      )}
    </>
  );
};
