import {
  Link as ChakraLink,
  Text,
  Code,
  Badge,
  SimpleGrid,
  Box,
} from "@chakra-ui/react";

import { Hero } from "../components/Hero";
import { Container } from "../components/Container";
import { Main } from "../components/Main";
import { DarkModeSwitch } from "../components/DarkModeSwitch";
import { CTA } from "../components/CTA";
import { Footer } from "../components/Footer";

const UseCases = () => {
  const useCases = [
    {
      sector: "Users",
      title: "eFIEL as Onboarding requirement",
      description: `
      There are almost 30M individual/companies in Mexico with a FIEL,
      Mexico’s digital certificate issued by the SAT (Tax Revenue Service).
      conFIEL uses this credential to register them as KYC-ed users against
      a Commercial Bank.
      `,
      keywords: ["FIEL", "KYC"],
    },
    {
      sector: "Accounts",
      title: "Digital wallets via XRP Ledger",
      description: `
      conFIEL uses a FIEL’s signature and a UUID to create a fully-functional
      XRP Ledger-based digital wallet. Accounts are managed using this secure
      credential, ensuring these wallets comply with FATF’s Travel Rule requirements.
      `,
      keywords: ["XRP", "FATF"],
    },
    {
      sector: "Infrastructure",
      title: "Dashboard, Asset Custody and e-Wallet",
      description: `
      The application consists on a Web Dashboard showcasing the issuance of CBDCs,
      the hosting of a server to manage a Commercial Bank assets, and a self-managed
      XRP wallet.
      `,
      keywords: ["Web App", "Custody"],
    },
    {
      sector: "Payments",
      title: "Online payments or offline escrows",
      description: `
      conFIEL registered users can easily send CBDC payments using each other’s
      wallet address. Users can even send payments to unregistered users via
      shareable offline escrows.
      `,
      keywords: ["P2P", "Escrow"],
    },
  ];
  return (
    <Container height="100vh">
      <Hero />
      <Main>
        <Text color="text" mt={["10", null, "20"]}>
          <Code>conFIEL CBDC</Code> is a Mexico-focused retail-CBDC enhancing financial
          inclusion using the XRP Ledger and gubernamental-issued digital certificates
          with enough information to KYC users. Non-onboarded receive payments via escrows using a
          commercial bank as trustee, and can claim them with a cryptographic proof
          shared online or offline (e.g. via any messaging app).
        </Text>
        <SimpleGrid columns={[1, null, 2]} spacing="2" alignSelf="center">
          {useCases.map((useCase) => (
            <Box
              key={useCase.sector}
              maxW="sm"
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
            >
              <Box p="6">
                <Box display="flex" alignItems="baseline">
                  <Badge borderRadius="full" px="2" colorScheme="teal">
                    {useCase.sector}
                  </Badge>
                  <Box
                    color="gray.500"
                    fontWeight="semibold"
                    letterSpacing="wide"
                    fontSize="xs"
                    textTransform="uppercase"
                    ml="2"
                  >
                    {useCase.keywords[0]} &bull; {useCase.keywords[1]}
                  </Box>
                </Box>

                <Box mt="1" fontWeight="semibold" as="h4" lineHeight="tight">
                  {useCase.title}
                </Box>
                <Box mt="1" as="p" fontSize="sm" lineHeight="tight">
                  {useCase.description}
                </Box>
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      </Main>

      <DarkModeSwitch />
      <Footer>
        <Text textAlign="center">
          By{" "}
          <ChakraLink isExternal href="https://twitter.com/0xjjpa">
            Jose Aguinaga
          </ChakraLink>
          , a submission to the{" "}
          <ChakraLink isExternal href="https://ripplecbdc2.devpost.com/">
            Ripple CBDC Innovate (pt. 2)
          </ChakraLink>{" "}
          hackathon
        </Text>
      </Footer>
      <CTA />
    </Container>
  );
};

export default UseCases;
