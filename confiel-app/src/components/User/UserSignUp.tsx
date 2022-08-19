import { Code, Text } from "@chakra-ui/react";
import { titleCase } from "../../lib/helpers";
import { FIELSetup } from "../FIEL";
import { Credential } from "@nodecfdi/credentials";

export const UserSignUp = ({
    RFC,
    legalName,
    setFIEL,
    setRFC,
    setLegalName
}: {
    RFC: string,
    legalName: string,
    setFIEL: (fiel: Credential) => void;
    setRFC: (rfc: string) => void;
    setLegalName: (legalName: string) => void;
}) => (
  <>
    <Text color="text">
      Please upload your FIEL e.firma and password to get started.
    </Text>
    <Text fontSize="xs">
      Please upload the respective files (<Code fontSize="xs">.key</Code>,
      <Code fontSize="xs">.cer</Code>) to access your account.
    </Text>
    <FIELSetup setFIEL={setFIEL} setRFC={setRFC} setLegalName={setLegalName} />
    {RFC && legalName && (
      <Text>
        Welcome <Code>{titleCase(legalName)}</Code> with RFC <Code>{RFC}</Code>
      </Text>
    )}
  </>
);
