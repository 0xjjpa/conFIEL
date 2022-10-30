import { Button, Code, Link as ChakraLink } from "@chakra-ui/react";
import { useState } from "react";
import { truncate } from "../lib/helpers";
import { BankCopyIcon } from "./Bank/BankCopyIcon";

export const ClaimButton = ({
  claimedCallback,
  isLoadingClaim,
  submitPaymentClaim,
  claimedHash,
}: {
  claimedHash?: string;
  claimedCallback: (claimedTxHash: string) => void;
  isLoadingClaim: boolean;
  submitPaymentClaim: () => Promise<void | string>;
}) => {
  const paymentClaimHandler = async () => {
    const maybeHash = await submitPaymentClaim();
    if (maybeHash) {
      claimedCallback(maybeHash);
    }
  };

  return (
    <>
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
        <Button
          isLoading={isLoadingClaim}
          size="xs"
          onClick={() => paymentClaimHandler()}
        >
          Claim
        </Button>
      )}
    </>
  );
};
