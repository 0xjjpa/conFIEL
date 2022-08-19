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
          {wallet && balance && (
            <Text>
              Loaded wallet <Code>{wallet.address}</Code> with balance{" "}
              <Code>{balance}</Code> XRP
            </Text>
          )}
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
