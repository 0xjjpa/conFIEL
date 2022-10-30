import { Button, Code, Link as ChakraLink } from "@chakra-ui/react";
import { useState } from "react";
import { truncate } from "../lib/helpers";
import { BankCopyIcon } from "./Bank/BankCopyIcon";

export const ClaimButton = ({
  isLoadingClaim,
  submitPaymentClaim,
}: {
  isLoadingClaim: boolean;
  submitPaymentClaim: () => Promise<void | string>;
}) => {
  const [claimedHash, setClaimedHash] = useState<string>();

  const paymentClaimHandler = async () => {
    const maybeHash = await submitPaymentClaim();
    if (maybeHash) {
      setClaimedHash(maybeHash);
    }
  };

  return (
    <Button
      isLoading={isLoadingClaim}
      size="xs"
      onClick={() => paymentClaimHandler()}
    >
      {claimedHash ? (
        <>
          <ChakraLink
            isExternal
            href={`https://testnet.xrpl.org/transactions/${claimedHash}`}
          >
            <Code>{truncate(claimedHash, 60)}</Code>
          </ChakraLink>
          <BankCopyIcon address={claimedHash} />
        </>
      ) : (
        "Claim"
      )}
    </Button>
  );
};
