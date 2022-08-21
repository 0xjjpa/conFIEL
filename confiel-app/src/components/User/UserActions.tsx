import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Text,
  Code,
} from "@chakra-ui/react";
import { Credential } from "@nodecfdi/credentials";
import { Wallet } from "xrpl";
import { UserAccount } from "./UserAccount";

export const UserActions = ({
  FIEL,
  wallet,
  balance,
  SignUp = <></>,
}: {
  FIEL?: Credential;
  wallet: Wallet;
  balance: string;
  SignUp: JSX.Element;
}) => {
    
  return (
    <Tabs>
      <TabList>
        <Tab>Sign Up</Tab>
        {FIEL && <Tab>Account</Tab>}
      </TabList>

      <TabPanels>
        <TabPanel>{SignUp}</TabPanel>
        <TabPanel>
          {wallet && balance && FIEL && <UserAccount wallet={wallet} balance={balance} name={FIEL?.legalName()} />}
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
