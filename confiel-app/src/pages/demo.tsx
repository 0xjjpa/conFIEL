import { useEffect, useState } from "react";
import { Credential, SignatureAlgorithm } from "@nodecfdi/credentials";
import { Link as ChakraLink, Text, Code } from "@chakra-ui/react";
import "buffer";

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
import { NavBar } from "../components/NavBar";
import { UserActions } from "../components/User/UserActions";
import { UserSignUp } from "../components/User/UserSignUp";
import { CONFIEL_ROLES } from "../constants/roles";

const Index = () => {
  const [currentRole, setCurrentRole] = useState(undefined);
  const [xrpClient, setXRPClient] = useState<Client>(undefined);
  const [FIEL, setFIEL] = useState<Credential>(undefined);
  const [wallet, setWallet] = useState<Wallet>(undefined);
  const [balance, setBalance] = useState("");
  const [RFC, setRFC] = useState("");
  const [legalName, setLegalName] = useState("");

  const RIPPLE_TESTNET_ENDPOINT = "wss://s.altnet.rippletest.net:51233";

  useEffect(() => {
    const connectToXRP = async () => {
      const client = new Client(RIPPLE_TESTNET_ENDPOINT);
      await client.connect();
      setXRPClient(client);
    };
    connectToXRP();
  }, []);

  useEffect(() => {
    console.log('⚙️ Core Engine - Loading wallet from FIEL...')
    const createXRPWallet = async () => {
      console.log('⚙️ Core Engine - FIEL Loading, deriving wallet...')
      const walletSeed = FIEL.sign("ConFIEL", SignatureAlgorithm.MD5);
      const encoder = new TextEncoder();
      const encodedSeed = encoder.encode(walletSeed);
      const rfc1751 = btoe(encodedSeed);
      const FIELwallet = Wallet.fromMnemonic(rfc1751, {
        mnemonicEncoding: "rfc1751",
      });
      console.log(`⚙️ Core Engine - Wallet found, updating with ${FIELwallet.address}`)
      setWallet(FIELwallet);

      xrpClient
        .request({
          command: "account_info",
          account: FIELwallet.address,
          ledger_index: "validated",
        })
        .then((walletResponse) => {
          const balance = dropsToXrp(
            walletResponse.result.account_data.Balance
          );
          setBalance(balance);
        })
        .catch((err) => {
          console.error(err);
          setBalance("0.00");
        });
    };
    FIEL && createXRPWallet();
  }, [FIEL]);

  const userRole = (
    <>
    <Text>A user is any Mexican citizen that has registered to the SAT (Mexico’s Tax Revenue Service)
      and has been provided an e.Firma or FIEL, upon being KYC’ed by the Federal Authority. The FIEL
      contains a unique id known as RFC, and its public certificate has the user’s data.
    </Text>
    <UserActions
      FIEL={FIEL}
      balance={balance}
      wallet={wallet}
      SignUp={
        <UserSignUp
          RFC={RFC}
          legalName={legalName}
          setFIEL={setFIEL}
          setRFC={setRFC}
          setLegalName={setLegalName}
        />
      }
    />
    </>
  );

  return (
    <Container height="100vh">
      <Hero />
      <Main pb="20">
        <NavBar currentRole={currentRole} setCurrentRole={setCurrentRole} />
        {
          currentRole == CONFIEL_ROLES.USER && userRole
        }
      </Main>

      <DarkModeSwitch />
      <CTA />
    </Container>
  );
};

export default Index;
