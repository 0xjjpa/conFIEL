import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Text,
  Box,
} from "@chakra-ui/react";
import { Credential } from "@nodecfdi/credentials";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { Client, EscrowFinish, Wallet } from "xrpl";
import { ONBOARDING_FLOW } from "../../constants/onboarding";
import { TRANSACTIONS_TYPE } from "../../constants/transactions";
import { XRPL_SUCCESSFUL_TES_CODE } from "../../constants/xrpl";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import {
  buildEscrowCancel,
  buildEscrowFinish,
  includeConditions,
  isTransactionMetadata,
} from "../../lib/xrpl";
import { Account, BankStorage } from "../../types/BankStorage";
import {
  Transaction,
  TransactionsStorage,
} from "../../types/TransactionsStorage";
import { XRPLFaucetBank } from "../../types/XRPLFaucetResponse";
import { UserAccount } from "./UserAccount";
import { UserPay } from "./UserPay";
import { UserPayments } from "./UserPayments";
import { UserTransfer } from "./UserTransfer";

export const UserActions = ({
  bankId,
  xrplClient,
  FIEL,
  wallet,
  SignUp = <></>,
}: {
  bankId: string;
  xrplClient: Client;
  FIEL?: Credential;
  wallet: Wallet;
  SignUp: JSX.Element;
}) => {
  const [bank] = useLocalStorage(`bank`, {});
  const [transactions, setTransactions] = useLocalStorage(`transactions`, {});
  const [bankAddress, setBankAddress] = useState<string>("");
  const account: Account = (bank as BankStorage)[wallet?.address];

  const cancelPayment = async (offerSequence: number) => {
    const prepared = await xrplClient.autofill(
      buildEscrowCancel(wallet.address, offerSequence)
    );
    const signed = wallet.sign(prepared);
    const tx = await xrplClient.submitAndWait(signed.tx_blob);
    if (isTransactionMetadata(tx.result.meta)) {
      tx.result.meta.TransactionResult == XRPL_SUCCESSFUL_TES_CODE;
      console.log("Successfully cancelled.");
    }
  };

  const claimPayment = async (
    from: string,
    offerSequence: number,
    condition: string,
    fulfillment: string
  ) => {
    console.log(
      "Started claim... (v2)",
      offerSequence,
      condition,
      fulfillment,
      from
    );
    const prepared = await xrplClient.autofill(
      includeConditions(
        buildEscrowFinish(wallet?.address, from, offerSequence),
        condition,
        fulfillment
      )
    );
    const signed = wallet.sign(prepared);
    const tx = await xrplClient.submitAndWait(signed.tx_blob);
    if (isTransactionMetadata(tx.result.meta) && tx.result.meta.TransactionResult == XRPL_SUCCESSFUL_TES_CODE) {
      const transactionId = `${wallet.address}-${from}`;
      const existingTransactions: Transaction[] =
        (transactions as TransactionsStorage)[transactionId] || [];
      const newTransaction: Transaction = {
        from: wallet.address,
        to: from,
        hash: tx.result.hash,
        type: TRANSACTIONS_TYPE.payment,
      };
      existingTransactions.push(newTransaction);
      setTransactions(
        Object.assign({}, transactions, {
          [transactionId]: existingTransactions,
        })
      );
      return tx.result.hash;
    }
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
    <Tabs>
      <TabList>
        <Tab>Access</Tab>
        {FIEL && <Tab>Account</Tab>}
        {FIEL && <Tab>Payments</Tab>}
        {FIEL && account?.status == ONBOARDING_FLOW.account_approved && (
          <Tab>Actions</Tab>
        )}
      </TabList>

      <TabPanels>
        <TabPanel>{SignUp}</TabPanel>
        <TabPanel>
          {wallet && FIEL && (
            <UserAccount
              bankId={bankId}
              xrplClient={xrplClient}
              wallet={wallet}
              name={FIEL?.legalName()}
            />
          )}
        </TabPanel>
        <TabPanel>
          <UserPayments
            isApproved={account?.status == ONBOARDING_FLOW.account_approved}
            claimPayment={claimPayment}
            cancelPayment={cancelPayment}
            rfc={FIEL?.rfc()}
            address={wallet?.address}
          />
        </TabPanel>
        <TabPanel>
          <Box mb="3">
            <Text fontWeight="bold">Transfer</Text>
            <Text fontSize="sm">
              Send an already existing user 0.05 to their balance.
            </Text>
            <UserTransfer xrplClient={xrplClient} wallet={wallet} />
          </Box>
          <Box mb="3">
            <Text fontWeight="bold">Pay</Text>
            <Text fontSize="sm">
              Send anybody with an RFC 0.05 to their balance.
            </Text>
            <UserPay
              bankAddress={bankAddress}
              xrplClient={xrplClient}
              wallet={wallet}
            />
          </Box>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
