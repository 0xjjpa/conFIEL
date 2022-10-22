import { Tabs, TabList, Tab, TabPanels, TabPanel, Text } from "@chakra-ui/react";
import { Credential } from "@nodecfdi/credentials";
import { Client, Wallet } from "xrpl";
import { ONBOARDING_FLOW } from "../../constants/onboarding";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { Account, BankStorage } from "../../types/BankStorage";
import { UserAccount } from "./UserAccount";
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
  const account: Account = (bank as BankStorage)[wallet?.address];
  return (
    <Tabs>
      <TabList>
        <Tab>Sign Up</Tab>
        {FIEL && <Tab>Account</Tab>}
        {FIEL && account?.status == ONBOARDING_FLOW.account_approved && <Tab>Actions</Tab>}
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
          <Text fontWeight="bold">Transfer</Text>
          <UserTransfer xrplClient={xrplClient} wallet={wallet}/>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
