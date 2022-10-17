import { useEffect, useState } from "react";
import { Credential, SignatureAlgorithm } from "@nodecfdi/credentials";
import { Link as ChakraLink, Text, Code } from "@chakra-ui/react";


import { Hero } from "../components/Hero";
import { Container } from "../components/Container";
import { Main } from "../components/Main";
import { DarkModeSwitch } from "../components/DarkModeSwitch";
import { CTA } from "../components/CTA";
import { Footer } from "../components/Footer";
import { FIELSetup } from "../components/User/UserFIEL";
import { titleCase } from "../lib/helpers";
import { Client, dropsToXrp, Wallet } from "xrpl";

import { NavBar } from "../components/NavBar";
import { UserActions } from "../components/User/UserActions";
import { UserSignUp } from "../components/User/UserSignUp";
import { CONFIEL_ROLES } from "../constants/roles";
import { BankView } from "../components/Bank/BankView";
import { DEFAULT_XRPL_API_URL } from "../constants/xrpl";
import { CentralBankView } from "../components/CentralBank/CentralBankView";
import { getCookies } from "cookies-next";

const Index = () => {
  const [currentRole, setCurrentRole] = useState(undefined);
  const [xrplClient, setXRPLClient] = useState<Client>(undefined);
  const [FIEL, setFIEL] = useState<Credential>(undefined);
  const [wallet, setWallet] = useState<Wallet>(undefined);
  const [balance, setBalance] = useState("");
  const [RFC, setRFC] = useState("");
  const [legalName, setLegalName] = useState("");

  useEffect(() => {
    const connectToXRP = async () => {
      const client = new Client(DEFAULT_XRPL_API_URL);
      await client.connect();
      setXRPLClient(client);
    };
    connectToXRP();
  }, []);

  const bankRole = (
    <>
    <Text>
      A bank is a regulated centralized entity able to issue digital currencies such as
      stablecoins to provide users with online payment capabilities. Although payments can
      be done peer-to-peer (P2P), a bank is always able to freeze and control transfers
      if needed to be comply with local authorities.
    </Text>
    <BankView />
    </>
  )

  const centralBankRole = (
    <>
      <Text>
      A central bank is an institution that manages the currency and monetary policy of a
      country. Central Banks can issue new digital currencies (CBDC) which can then be used
      by Commercial Banks for multiple retail-based use cases to increase adoption in the
      financial sector.
      </Text>
      <CentralBankView />
    </>
  )

  const userRole = (
    <>
    <Text>A user is any Mexican citizen that has registered to the SAT (Mexico’s Tax Revenue Service)
      and has been provided an e.Firma or FIEL, upon being KYC’ed by the Federal Authority. The FIEL
      contains a unique id known as RFC, and its public certificate has the user’s data.
    </Text>
    <UserActions
      xrplClient={xrplClient}
      FIEL={FIEL}
      wallet={wallet}
      SignUp={
        <UserSignUp
          RFC={RFC}
          legalName={legalName}
          setFIEL={setFIEL}
          setRFC={setRFC}
          setLegalName={setLegalName}
          setWallet={setWallet}
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
        {
          currentRole == CONFIEL_ROLES.CENTRAL_BANK && centralBankRole
        }
        {
          currentRole == CONFIEL_ROLES.BANK && bankRole
        }
      </Main>

      <DarkModeSwitch />
      <CTA />
    </Container>
  );
};

export default Index;
