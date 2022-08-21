import { Code, Text, Button, ButtonGroup } from "@chakra-ui/react";
import { titleCase } from "../../lib/helpers";
import { FIELSetup } from "../FIEL";
import { Certificate, Credential } from "@nodecfdi/credentials";

export const UserSignUp = ({
  RFC,
  legalName,
  setFIEL,
  setRFC,
  setLegalName,
}: {
  RFC: string;
  legalName: string;
  setFIEL: (fiel: Credential) => void;
  setRFC: (rfc: string) => void;
  setLegalName: (legalName: string) => void;
}) => {
  const resetUsers = () => {
    setFIEL(undefined);
    setRFC(undefined);
    setLegalName(undefined);
  };
  const loadMockUser = async () => {
    const blobPrivateKey = await (
      await fetch("/mocks/maria/private.key")
    ).arrayBuffer();
    const blobCertificate = await (
      await fetch("/mocks/maria/public.cer")
    ).arrayBuffer();
    const privateKey = Buffer.from(await blobPrivateKey).toString("binary");
    const certificate = Buffer.from(await blobCertificate).toString("binary");
    const fiel = Credential.create(
      String(certificate),
      String(privateKey),
      "12345678a"
    );
    const eFirma = fiel.certificate();
    setFIEL(fiel);
    setRFC(eFirma.rfc());
    setLegalName(eFirma.legalName());
  };
  return (
    <>
      {!RFC && !legalName && (
        <>
          <Text color="text">
            To get started, pre-load one of our users into the system.
          </Text>
          <ButtonGroup>
            <Button size="xs" my="5" onClick={loadMockUser}>
              Load Maria
            </Button>
          </ButtonGroup>
          <Text color="text" mb="2">
            Alternatively, you can upload your FIEL e.firma and password to get
            started.
          </Text>
        </>
      )}
      {RFC && legalName ? (
        <>
          <Text>
            Welcome <Code>{titleCase(legalName)}</Code> with RFC{" "}
            <Code>{RFC}</Code>
          </Text>
          <Button size="xs" my="5" onClick={resetUsers}>
            Logout
          </Button>
        </>
      ) : (
        <>
          <Text fontSize="xs">
            Please upload the respective files (<Code fontSize="xs">.key</Code>,
            <Code fontSize="xs">.cer</Code>) to access your account.
          </Text>
          <FIELSetup
            setFIEL={setFIEL}
            setRFC={setRFC}
            setLegalName={setLegalName}
          />
        </>
      )}
    </>
  );
};
