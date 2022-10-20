import { Code, Text, Button, ButtonGroup, Flex } from "@chakra-ui/react";
import { titleCase } from "../../lib/helpers";
import { FIELSetup } from "./UserFIEL";
import { Credential } from "@nodecfdi/credentials";
import { Wallet } from "xrpl";
import { xrpld } from "../../lib/xrpld";
import { useEffect, useState } from "react";
import { BANKS } from "../../constants/banks";
import { Bank } from "../../types/Banks";
import { BankItem } from "../Bank/BankItem";
import { useRouter } from "next/router";

export const UserSignUp = ({
  bankId,
  RFC,
  legalName,
  setFIEL,
  setRFC,
  setLegalName,
  setWallet,
}: {
  bankId: string;
  RFC: string;
  legalName: string;
  setFIEL: (fiel: Credential) => void;
  setWallet: (wallet: Wallet) => void;
  setRFC: (rfc: string) => void;
  setLegalName: (legalName: string) => void;
}) => {
  const [isLoading, setLoading] = useState(false);
  const [bankItem, setBankItem] = useState<Bank>();
  const router = useRouter()
  const { id } = router?.query;
  const basePath = `${bankId}/0`;
  const derivationPath = id ? `${basePath}/${id}` : basePath;
  const resetUsers = () => {
    setFIEL(undefined);
    setRFC(undefined);
    setLegalName(undefined);
  };
  const loadMockUser = async (callback: () => void, user = "maria") => {
    const blobPrivateKey = await (
      await fetch(`/mocks/${user}/private.key`)
    ).arrayBuffer();
    const blobCertificate = await (
      await fetch(`/mocks/${user}/public.cer`)
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
    const wallet = xrpld(fiel, derivationPath);
    setWallet(wallet);
    callback();
  };

  const loadXRPFromMock = async (user: string) => {
    setLoading(true);
    await new Promise<void>((res) =>
      setTimeout(() => loadMockUser(res, user), 0)
    );
    setLoading(false);
  };

  useEffect(() => {
    const loadBankData = async () => {
      if (bankId) {
        const bank = BANKS.find((bank) => bank.id == bankId);
        setBankItem(bank);
      }
    };
    loadBankData();
  }, [bankId]);

  return (
    <>
      <Flex alignItems="center">
        {bankItem && <BankItem bank={bankItem} />}
      </Flex>
      {!RFC && !legalName && (
        <>
          <Text color="text">
            To get started, pre-load one of our users into the system.
          </Text>
          <ButtonGroup>
            <Button
              size="xs"
              my="5"
              isLoading={isLoading}
              onClick={() => loadXRPFromMock("maria")}
            >
              Load Maria
            </Button>
            <Button
              size="xs"
              my="5"
              isLoading={isLoading}
              onClick={() => loadXRPFromMock("xochilt")}
            >
              Load Xochilt
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
            bankId={bankId}
            setWallet={setWallet}
            setFIEL={setFIEL}
            setRFC={setRFC}
            setLegalName={setLegalName}
          />
        </>
      )}
    </>
  );
};
