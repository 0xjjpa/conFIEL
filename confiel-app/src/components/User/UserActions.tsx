import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import { Credential } from "@nodecfdi/credentials";
import { Wallet } from "xrpl";
import { UserAccount } from "./UserAccount";

export const UserActions = ({
  FIEL,
  wallet,
  SignUp = <></>,
}: {
  FIEL?: Credential;
  wallet: Wallet;
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
          {wallet && FIEL && <UserAccount wallet={wallet} name={FIEL?.legalName()} />}
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
