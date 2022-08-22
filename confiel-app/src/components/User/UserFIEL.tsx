import { ArrowUpIcon } from "@chakra-ui/icons";
import { Credential } from "@nodecfdi/credentials";

import {
  Flex,
  Code,
  IconButton,
  InputGroup,
  Input,
  InputRightElement,
  Button,
  Text,
} from "@chakra-ui/react";
import { useState, useRef } from "react";
import { shorten } from "../../lib/helpers";
import { Wallet } from "xrpl";
import { xrpld } from "../../lib/xrpld";

export const FIELSetup = ({
  setWallet,
  setFIEL,
  setRFC,
  setLegalName,
}: {
  setWallet: (wallet: Wallet) => void;
  setFIEL: (fiel: Credential) => void;
  setRFC: (rfc: string) => void;
  setLegalName: (legalName: string) => void;
}) => {
  const [keyFilename, setKeyFilename] = useState("");
  const [cerFilename, setCerFilename] = useState("");
  const [password, setPassword] = useState("");
  const [privateKey, setPrivateKey] = useState<ArrayBuffer | string>(undefined);
  const [certificate, setCertificate] = useState<ArrayBuffer | string>(
    undefined
  );
  const [isLoading, setLoading] = useState(false);
  const hiddenFileInputKey = useRef(null);
  const hiddenFileInputCer = useRef(null);

  const handleChangeKey = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = (event.target as HTMLInputElement).files[0];
      setKeyFilename(shorten(file.name, 10, 10));
      const keyReader = new FileReader();
      keyReader.onload = () => {
        setPrivateKey(keyReader.result);
      };
      keyReader.readAsBinaryString(file);
    }
  };

  const handleClickKey = () => {
    hiddenFileInputKey.current.click();
  };

  const handleChangeCer = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = (event.target as HTMLInputElement).files[0];
      setCerFilename(file.name);
      const certReader = new FileReader();
      certReader.onload = () => {
        setCertificate(certReader.result);
      };
      certReader.readAsBinaryString(file);
    }
  };

  const handleChangePassword = (e) => setPassword(e.target.value);

  const handleClickCer = () => {
    hiddenFileInputCer.current.click();
  };

  const handleXRPGeneration = () => {
    setLoading(true);
    const fiel = Credential.create(
      String(certificate),
      String(privateKey),
      password
    );
    const eFirma = fiel.certificate();
    setFIEL(fiel);
    setRFC(eFirma.rfc());
    setLegalName(eFirma.legalName());
    setLoading(false);
    const wallet = xrpld(fiel);
    setWallet(wallet);
  };

  return (
    <>
      <Flex direction="row" justifyContent="space-between" alignItems="center">
        <Flex>
          <Text mr={2}>
            Upload <Code>.key</Code>
          </Text>
          <input
            type="file"
            ref={hiddenFileInputKey}
            onChange={handleChangeKey}
            accept=".key"
            style={{ display: "none" }}
          />
          <IconButton
            onClick={handleClickKey}
            size="small"
            aria-label="file upload "
            icon={<ArrowUpIcon />}
          />
        </Flex>
        <Text fontSize="xs">
          {keyFilename ? keyFilename : "No private key selected."}
        </Text>
      </Flex>
      <Flex direction="row" justifyContent="space-between" alignItems="center">
        <Flex>
          <Text mr={2}>
            Upload <Code>.cer</Code>
          </Text>
          <input
            type="file"
            ref={hiddenFileInputCer}
            onChange={handleChangeCer}
            accept=".cer"
            style={{ display: "none" }}
          />
          <IconButton
            onClick={handleClickCer}
            size="small"
            aria-label="file upload "
            icon={<ArrowUpIcon />}
          />
        </Flex>
        <Text fontSize="xs">
          {cerFilename ? cerFilename : "No certificate selected."}
        </Text>
      </Flex>
      {privateKey && certificate && (
        <InputGroup size="md">
          <Input
            pr="4.5rem"
            type="password"
            value={password}
            onChange={handleChangePassword}
            placeholder="Enter private key password"
          />
          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              disabled={!(password.length > 0)}
              isLoading={isLoading}
              size="sm"
              onClick={handleXRPGeneration}
            >
              Enter
            </Button>
          </InputRightElement>
        </InputGroup>
      )}
    </>
  );
};
