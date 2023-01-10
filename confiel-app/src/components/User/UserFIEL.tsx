import { ArrowUpIcon } from "@chakra-ui/icons";
import { Credential, SignatureAlgorithm } from "@nodecfdi/credentials";
import { KEYUTIL, RSAKey, hex2b64 } from 'jsrsasign';

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
import { useRouter } from "next/router";

export const FIELSetup = ({
  bankId,
  setWallet,
  setFIEL,
  setRFC,
  setLegalName,
}: {
  bankId: string;
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

  const str2ab = (str: string) => {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }

  const bufferToHex = (buffer: ArrayBuffer) => {
    return [...new Uint8Array (buffer)]
        .map (b => b.toString (16).padStart (2, "0"))
        .join ("");
}

  const importPrivateKey = async (pem: string) => {
    // fetch the part of the PEM string between header and footer
    const pemHeader = "-----BEGIN PRIVATE KEY-----";
    const pemFooter = "-----END PRIVATE KEY-----";
    const pemContents = pem.substring(pemHeader.length, pem.length - pemFooter.length - 2);
    console.log("🔑 PEM Contents", pemContents);
    // base64 decode the string to get the binary data
    const binaryDerString = window.atob(pemContents);
    // convert from a binary string to an ArrayBuffer
    const binaryDer = str2ab(binaryDerString);

    return window.crypto.subtle.importKey(
      "pkcs8",
      binaryDer,
      {
        name: "RSASSA-PKCS1-v1_5",
        hash: "SHA-256",
      },
      true,
      ["sign"]
    );
  }

  const router = useRouter()
  const { id } = router?.query;
  const basePath = `${bankId}/0`;
  const derivationPath = id ? `${basePath}/${id}` : basePath;

  const handleXRPGeneration = async (callback: () => void) => {
    console.log("🔑 Private Key", privateKey)
    console.log("🪪 Certificate", certificate)
    const fiel = Credential.create(
      String(certificate),
      String(privateKey),
      password
    );

    const rsaKey: RSAKey = KEYUTIL.getKeyFromEncryptedPKCS8PEM(fiel.privateKey().pem(), fiel.privateKey().passPhrase())
    const decryptedPEM = KEYUTIL.getPEM(rsaKey, "PKCS8PRV");
    console.log("🔑 Decrypted Key (PEM)", decryptedPEM);
    const cryptoKey = await importPrivateKey(decryptedPEM);
    console.log("🔑 Crypto Key (Web API)", cryptoKey);

    const co = "ZDQ2YjM1MDItNTQwZS00NzVmLWFkNzMtZjY3NjY1MDU1NTM0|PEAJ891121U75|00001000000515837227";
    const lf = "UFRMWkluTGNRRHZiR0syYitGSmhGS3NGaHppNW5RL3VvbzgzK1ZLRnkyTlozZ3BjMkZUdFY3UXcvczh0Uk1ZNm9EbHd5SGZQU2s5WmxxNFRZLzlqTGc0YW5IMGVCZXV1S2NZR1pRT1hSZFRNRStqa2p2ZUVXeEJHZ25jRWdqNDc5djBoOWFPUEUzWFNTajA2eVFJaXpvY2ZwSWNQUUpzREVPY09xdVVsZXZPY1AvRWpVYlQwYmcxdlYwUnpVK0JtY3JsbzUvMGZHeDYrcHYrNUdVdi9xT0l4aldDQUpNS09QTDNHaVJYOFdvb1Rlc0pwdFppWDNFeEZoSmJ4blFYL2xENE9sWnBBOCtpNUlLZis4NGZOSS9TSFJEcG8vOGlEbHNtN1pLMSs4bGNCTGFCTkVRbC9sRWIzdzJQcnZ0c2xUbWlIWnRUS0tMeXROQkpYYjVYL1lBPT0="
    const tok = "V2tSUk1sbHFUVEZOUkVsMFRsUlJkMXBUTURCT2VsWnRURmRHYTA1NlRYUmFhbGt6VG1wWk1VMUVWVEZPVkUwd2ZGQkZRVW80T1RFeE1qRlZOelY4TURBd01ERXdNREF3TURBMU1UVTRNemN5TWpjPSNVRlJNV2tsdVRHTlJSSFppUjBzeVlpdEdTbWhHUzNOR2FIcHBOVzVSTDNWdmJ6Z3pLMVpMUm5reVRsb3paM0JqTWtaVWRGWTNVWGN2Y3poMFVrMVpObTlFYkhkNVNHWlFVMnM1V214eE5GUlpMemxxVEdjMFlXNUlNR1ZDWlhWMVMyTlpSMXBSVDFoU1pGUk5SU3RxYTJwMlpVVlhlRUpIWjI1alJXZHFORGM1ZGpCb09XRlBVRVV6V0ZOVGFqQTJlVkZKYVhwdlkyWndTV05RVVVwelJFVlBZMDl4ZFZWc1pYWlBZMUF2UldwVllsUXdZbWN4ZGxZd1VucFZLMEp0WTNKc2J6VXZNR1pIZURZcmNIWXJOVWRWZGk5eFQwbDRhbGREUVVwTlMwOVFURE5IYVZKWU9GZHZiMVJsYzBwd2RGcHBXRE5GZUVab1NtSjRibEZZTDJ4RU5FOXNXbkJCT0N0cE5VbExaaXM0TkdaT1NTOVRTRkpFY0c4dk9HbEViSE50TjFwTE1TczRiR05DVEdGQ1RrVlJiQzlzUldJemR6SlFjblowYzJ4VWJXbElXblJVUzB0TWVYUk9Ra3BZWWpWWUwxbEJQVDA9"
    const MESSAGE_TO_SIGN = 'Hi there';

    const encoded = new TextEncoder().encode(MESSAGE_TO_SIGN);
    const signature = await window.crypto.subtle.sign(
      "RSASSA-PKCS1-v1_5",
      cryptoKey,
      encoded
    );
    const signatureAsHex = bufferToHex(signature);
    console.log("🧾 Signature (Web Crypto API)", signatureAsHex);

    // const digestAsHex = RSAKey.signString(co, 'sha1')
    // const digestAsB64 = hex2b64(digestAsHex)
    // const LF = Base64.encode(digestAsB64)
    // const token = Base64.encode(Base64.encode(co) + "#" + LF);

    const digestAsHex = fiel.sign(co, SignatureAlgorithm.SHA1)
    console.log("🧾 SHA1(co) as Hex (from Fiel)", digestAsHex);
    const digestAsB64 = hex2b64(digestAsHex)
    console.log("🧾 SHA1(co) as B64 (from Fiel)", digestAsB64);
    const LF = btoa(digestAsB64)

    console.log("🔑 Generated LF", LF);
    console.log("🔑 Obtained LF", lf);
    

    const signatureFromFIEL = fiel.sign(MESSAGE_TO_SIGN);
    console.log("🧾 Signature (From FIEL)", signatureFromFIEL);

    const signatureFromFIELAsBase64 = btoa(signatureFromFIEL);
    console.log("🧾 Signature (From FIEL, base64)", signatureFromFIELAsBase64);

    console.log("🧾 Signature (From SAT, base64)", lf);
    console.log("🧾 Token/Signature (From SAT)", tok);

    const eFirma = fiel.certificate();
    setFIEL(fiel);
    setRFC(eFirma.rfc());
    setLegalName(eFirma.legalName());
    const wallet = xrpld(fiel, derivationPath);
    setWallet(wallet);
    callback();
  };

  const loadXRPFromWallet = async () => {
    setLoading(true);
    await new Promise<void>((res) =>
      setTimeout(() => handleXRPGeneration(res), 100)
    );
    setLoading(false);
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
              onClick={() => loadXRPFromWallet()}
            >
              Enter
            </Button>
          </InputRightElement>
        </InputGroup>
      )}
    </>
  );
};
