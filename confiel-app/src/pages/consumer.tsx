import { useState } from "react";
import { Credential } from "@nodecfdi/credentials";
import { Link as ChakraLink, Text, Code } from "@chakra-ui/react";

import { Hero } from "../components/Hero";
import { Container } from "../components/Container";
import { Main } from "../components/Main";
import { DarkModeSwitch } from "../components/DarkModeSwitch";
import { CTA } from "../components/CTA";
import { Footer } from "../components/Footer";
import { FIELSetup } from "../components/FIEL";
import { titleCase } from "../lib/helpers";

const Index = () => {
  const [eFirma, setFIEL] = useState<Credential>(undefined);
  const [RFC, setRFC] = useState("");
  const [legalName, setLegalName] = useState("");

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
