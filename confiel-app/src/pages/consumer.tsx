import { useEffect, useState } from "react";
import { Credential, SignatureAlgorithm } from "@nodecfdi/credentials";
import { Link as ChakraLink, Text, Code } from "@chakra-ui/react";
import "buffer"

import { Hero } from "../components/Hero";
import { Container } from "../components/Container";
import { Main } from "../components/Main";
import { DarkModeSwitch } from "../components/DarkModeSwitch";
import { CTA } from "../components/CTA";
import { Footer } from "../components/Footer";
import { FIELSetup } from "../components/FIEL";
import { titleCase } from "../lib/helpers";
import { Client, dropsToXrp, Wallet } from "xrpl";
import { btoe } from "rfc1751.js";

const Index = () => {
  const [xrpClient, setXRPClient] = useState<Client>(undefined);
  const [FIEL, setFIEL] = useState<Credential>(undefined);
  const [wallet, setWallet] = useState<Wallet>(undefined);
  const [balance, setBalance] = useState("");
  const [RFC, setRFC] = useState("");
  const [legalName, setLegalName] = useState("");
  
  const RIPPLE_TESTNET_ENDPOINT = "wss://s.altnet.rippletest.net:51233"

  useEffect(() => {
    const connectToXRP = async() => {
      const client = new Client(RIPPLE_TESTNET_ENDPOINT)
      await client.connect()
      setXRPClient(client);
    }
    connectToXRP();
  }, [])

  useEffect(() => {
    const createXRPWallet = async () => {
      const walletSeed = FIEL.sign("ConFIEL", SignatureAlgorithm.MD5);
      const encoder = new TextEncoder();
      const encodedSeed = encoder.encode(walletSeed);
      const rfc1751 = btoe(encodedSeed);
      const FIELwallet = Wallet.fromMnemonic(rfc1751, { mnemonicEncoding: "rfc1751"});
      setWallet(FIELwallet);
      
      const walletResponse = await xrpClient.request({
        "command": "account_info",
        "account": FIELwallet.address,
        "ledger_index": "validated"
      })
      const balance = dropsToXrp(walletResponse.result.account_data.Balance)
      setBalance(balance);
    }
    FIEL && createXRPWallet();
  }, [FIEL, xrpClient])

  return (
    <Container height="100vh">
      <Hero />
      <Main>
        <Text color="text" mt="10">
          The Consumer workflow starts by uploading a FIEL e.firma which
          generates a <Code>XRP</Code> account.
        </Text>
        <Text fontSize="xs">
          Please upload the respective files (<Code fontSize="xs">.key</Code>,
          <Code fontSize="xs">.cer</Code>) to generate your account.
        </Text>
        <FIELSetup
          setFIEL={setFIEL}
          setRFC={setRFC}
          setLegalName={setLegalName}
        />
        { RFC && legalName && <Text>Loaded <Code>{titleCase(legalName)}</Code> with RFC <Code>{RFC}</Code></Text> }
        { wallet && balance && <Text>Loaded wallet <Code>{wallet.address}</Code> with balance <Code>{balance}</Code> XRP</Text>}
      </Main>

      <DarkModeSwitch />
      <Footer>
        <Text>
          By{" "}
          <ChakraLink isExternal href="https://twitter.com/0xjjpa">
            Jose Aguinaga
          </ChakraLink>
          , a submission to the{" "}
          <ChakraLink isExternal href="https://ripplecbdc.devpost.com/">
            Ripple CBDC Innovate
          </ChakraLink>{" "}
          hackathon
        </Text>
      </Footer>
      <CTA />
    </Container>
  );
};

export default Index;
