import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@chakra-ui/react";
import { Credential } from "@nodecfdi/credentials";
import { Client, Wallet } from "xrpl";
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
  return (
    <Tabs>
      <TabList>
        <Tab>Sign Up</Tab>
        {FIEL && <Tab>Account</Tab>}
        {FIEL && <Tab>Transfer</Tab>}
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
          <UserTransfer xrplClient={xrplClient} wallet={wallet}/>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
