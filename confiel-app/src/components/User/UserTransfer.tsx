import {
  InputGroup,
  Input,
  InputRightElement,
  Button,
  Text,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { useState } from "react";
import { Client, Wallet } from "xrpl";
import { DEFAULT_FUNDING_AMOUNT } from "../../constants/bank";
import { XRPL_SUCCESSFUL_TES_CODE } from "../../constants/xrpl";
import { buildTransaction, isTransactionMetadata } from "../../lib/xrpl";

export const UserTransfer = ({
  xrplClient,
  wallet,
}: {
  xrplClient: Client;
  wallet: Wallet;
}) => {
  const [addressToTransfer, setAddressToTransfer] = useState("");
  const [transferTx, setTransferTx] = useState("");
  const [isSuccessful, setSuccessful] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const handleChangeAddress = (e) => setAddressToTransfer(e.target.value);

  const transferXRP = async () => {
    setLoading(true);
    console.log(`👤 User Module Found - Started transfer from ${wallet.address} to ${addressToTransfer}`);
    const prepared = await xrplClient.autofill(
      buildTransaction(
        wallet.address,
        `${addressToTransfer}`,
        `${DEFAULT_FUNDING_AMOUNT/100}`
      )
    );

    const signed = wallet.sign(prepared);
    const tx = await xrplClient.submitAndWait(signed.tx_blob);
    console.log(`👤 User Module Found - Completed`, tx);
    if (isTransactionMetadata(tx.result.meta)) {
      tx.result.meta.TransactionResult == XRPL_SUCCESSFUL_TES_CODE
      setSuccessful(true);
    }
    setTransferTx(tx.result.hash);
    setLoading(false);
  };

  return (
    <>
      <InputGroup size="md">
        <Input
          pr="4.5rem"
          type="text"
          value={addressToTransfer}
          onChange={handleChangeAddress}
          placeholder="Enter address to transfer 0.05 XRP"
        />
        <InputRightElement width="4.5rem">
          <Button
            h="1.75rem"
            disabled={!(addressToTransfer.length > 0)}
            isLoading={isLoading}
            size="sm"
            onClick={() => transferXRP()}
          >
            Enter
          </Button>
        </InputRightElement>
      </InputGroup>
      {transferTx.length > 0 && (
        <Text mt="2">
          Transfer {isSuccessful ? 'successful' : 'failed'} - {" "}
          <ChakraLink
            isExternal
            href={`
          https://testnet.xrpl.org/transactions/${transferTx}`}
          >
            See Transfer
          </ChakraLink>
        </Text>
      )}
    </>
  );
};
