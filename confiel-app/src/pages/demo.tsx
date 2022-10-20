import { useEffect, useState } from "react";
import { Credential, SignatureAlgorithm } from "@nodecfdi/credentials";
import { Link as ChakraLink, Text, Code, Flex } from "@chakra-ui/react";

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
import { getCookie, getCookies } from "cookies-next";
import { BankItem } from "../components/Bank/BankItem";
import { BANKS } from "../constants/banks";
import { Bank } from "../types/Banks";

const Index = () => {
  const [currentRole, setCurrentRole] = useState(undefined);
  const [bankItem, setBankItem] = useState<Bank>();
  const [xrplClient, setXRPLClient] = useState<Client>(undefined);
  const [FIEL, setFIEL] = useState<Credential>(undefined);
  const [wallet, setWallet] = useState<Wallet>(undefined);
  const [RFC, setRFC] = useState("");
  const [legalName, setLegalName] = useState("");
  const [currentBankId, setCurrentBankId] = useState<string>();

  const loadCurrentBankId = async () => {
    const bankId = getCookie("bank-current");
    if (bankId) {
      setCurrentBankId(String(bankId));
    }
  };

  const resetUsers = () => {
    setFIEL(undefined);
    setRFC(undefined);
    setLegalName(undefined);
  }

  useEffect(() => {
    const loadBankData = async () => {
      if (currentBankId) {
        const bank = BANKS.find((bank) => bank.id == currentBankId);
        setBankItem(bank);
      }
    };
    loadBankData();
  }, [currentBankId]);

  useEffect(() => {
    const connectToXRP = async () => {
      const client = new Client(DEFAULT_XRPL_API_URL);
      await client.connect();
      setXRPLClient(client);
    };
    connectToXRP();
    loadCurrentBankId();
  }, []);

  const bankRole = (
    <>
      <Text>
        A commercial bank is a regulated centralized entity able to distribute
        issued retail-CBDCs to their users with their existing infrastructure
        and payment capabilities. Once issued, users can then exchange goods and
        values given the CBDC agreed value.
      </Text>
      <BankView bankId={currentBankId} currentWallet={wallet} />
    </>
  );

  const centralBankRole = (
    <>
      <Text>
        Banxico is Mexico’s central bank, which manages the currency and
        monetary policy of a country. Banxico can issue new digital currencies
        (CBDC) which can then be used by Commercial Banks for multiple
        retail-based use cases to increase adoption in the financial sector.
      </Text>
      <CentralBankView
        selectBank={() => {
          setCurrentRole(CONFIEL_ROLES.BANK);
          loadCurrentBankId();
          resetUsers();
        }}
      />
    </>
  );

  const userRole = (
    <>
      <Text>
        A user is any Mexican citizen that has registered to the SAT (Mexico’s
        Tax Revenue Service) and has been provided an e.Firma or FIEL, upon
        being KYC’ed by the Federal Authority. The FIEL contains a unique id
        known as RFC, and its public certificate has the user’s data.
      </Text>
      <Flex alignItems="center">
        {bankItem && <BankItem bank={bankItem} />}
      </Flex>
      <UserActions
        bankId={currentBankId}
        xrplClient={xrplClient}
        FIEL={FIEL}
        wallet={wallet}
        SignUp={
          <UserSignUp
            resetUsers={resetUsers}
            bankId={currentBankId}
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
        <NavBar currentBankId={currentBankId} currentRole={currentRole} setCurrentRole={setCurrentRole} />
        {currentRole == CONFIEL_ROLES.USER && userRole}
        {currentRole == CONFIEL_ROLES.CENTRAL_BANK && centralBankRole}
        {currentRole == CONFIEL_ROLES.BANK && bankRole}
      </Main>

      <DarkModeSwitch />
      <CTA />
    </Container>
  );
};

export default Index;
