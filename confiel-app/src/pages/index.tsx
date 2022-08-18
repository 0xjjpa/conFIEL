import {
  Link as ChakraLink,
  Text,
  Code,
  List,
  ListIcon,
  ListItem,
} from "@chakra-ui/react";
import { CheckCircleIcon, LinkIcon } from "@chakra-ui/icons";

import { Hero } from "../components/Hero";
import { Container } from "../components/Container";
import { Main } from "../components/Main";
import { DarkModeSwitch } from "../components/DarkModeSwitch";
import { CTA } from "../components/CTA";
import { Footer } from "../components/Footer";

const Index = () => (
  <Container height="100vh">
    <Hero />
    <Main>
      <Text color="text" mt="10">
        <Code>conFIEL</Code> is a proof-of-concept for building a CBDC on top of <Code>XRP Ledger</Code> in Mexico
        using <ChakraLink isExternal href="https://www.sat.gob.mx/home">SAT</ChakraLink> (Mexican IRS) digital
        signatures called <Code>FIEL</Code> (or e.Firma).
      </Text>
      
      <List spacing={3} my={0} color="text">
        <ListItem>
          <ListIcon as={CheckCircleIcon} color="green.500" />
            <Code>XRP</Code> accounts are derived from a FIEL{' '}
            <Code><ChakraLink isExternal href="https://www.scielo.org.mx/pdf/cys/v23n2/1405-5546-cys-23-02-477.pdf">RSA-2048</ChakraLink></Code>{' '}
            signature as a{' '}
            <Code><ChakraLink isExternal href="https://en.wikipedia.org/wiki/Elliptic_Curve_Digital_Signature_Algorithm">secp256k1-ECDSA</ChakraLink></Code>{' '}
            seed.
        </ListItem>
        <ListItem>
          <ListIcon as={CheckCircleIcon} color="green.500" />
            Supports <Code>X.509 PEM,DER</Code> certificates and <Code>PKCS#8 PEM,DEM</Code> or <Code>PKCS#5 PEM</Code> private keys.
        </ListItem>
      </List>
    </Main>

    <DarkModeSwitch />
    <Footer>
      <Text>
      By{' '}
      <ChakraLink isExternal href="https://twitter.com/0xjjpa">Jose Aguinaga</ChakraLink>,{' '}
      a submission to the{' '}
      <ChakraLink isExternal href="https://ripplecbdc.devpost.com/">Ripple CBDC Innovate</ChakraLink>{' '}
      hackathon
      </Text>
    </Footer>
    <CTA />
  </Container>
);

export default Index;
