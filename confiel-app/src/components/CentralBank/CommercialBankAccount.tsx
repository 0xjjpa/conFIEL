import { Flex, Text } from "@chakra-ui/react";
import { Balance } from "../Balance";
import { AddressExplorerLink } from "../AddressExplorerLink";

export const CommercialBankAccount = ({ address }: { address: string }) => {
  const component = address ? (
    <Flex alignItems="center">
      <Balance address={address} />
      <AddressExplorerLink address={address} />
    </Flex>
  ) : (
    <Text>Issue CBDC</Text>
  );
  return component;
};
