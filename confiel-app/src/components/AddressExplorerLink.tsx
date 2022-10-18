import { Link as ChakraLink } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
export const AddressExplorerLink = ({ address }: { address: string }) => {
  return (
    <>
      <ChakraLink
        display="flex"
        alignItems="center"
        ml="1"
        isExternal
        href={`https://testnet.xrpl.org/accounts/${address}`}
      >
        <ExternalLinkIcon boxSize="3" />
      </ChakraLink>
    </>
  );
};
