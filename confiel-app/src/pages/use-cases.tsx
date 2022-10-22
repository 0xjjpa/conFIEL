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
      sector: "Financial",
      title: "Automatic tax-settlement",
      description: `
      By leveraging on conFIEL, a CBDC that can automatically calculate and deduct
      the respective tax rates from transactions between individulas and companies
      can be implemented by analysing the digital transactions.
      `,
      keywords: ["Taxes", "Banking"],
    },
    {
      sector: "Retail",
      title: "KYC-ed online purchases",
      description: `
      Since conFIEL derives a wallet using a central authority certificate, basic
      information about the owners of these wallets can be shared on an e-commerce
      platform, avoiding illegal purchases and reducing fraud.
      `,
      keywords: ["Fraud", "E-commerce"],
    },
    {
      sector: "Goverment",
      title: "UBI Implementation",
      description: `
      The Mexican goverment issues a series of subsidies for low-income individuals,
      which more often than not reside on remote rural areas. This last mile could be
      bridged by using conFIEL which has a verified identity.
      `,
      keywords: ["UBI", "Finance"],
    },
    {
      sector: "SME (PyME)",
      title: "Digitalizing Contracts",
      description: `
      Digital signatures on contracts had been recently introduced in Mexico under NOM 151,
      a framework to regulate digital contracts. Using conFIEL and XRP Ledger, contracts can
      be created as NFTs with timestamps and metadata.
      `,
      keywords: ["Legal", "NFTs"],
    },
  ];
  return (
    <Container height="100vh">
      <Hero />
      <Main>
        <Text color="text" mt={["10", null, "20"]}>
          <Code>conFIEL CBDC</Code> is a retail-CBDC focused on financial
          inclusion by relying on the XRP Ledger and gubernamental-issued
          digital certificates which can be used to KYC users within a
          commercial bank system.
        </Text>
        <Text color="text" mt={["10", null, "20"]}>
          Non-onboarded users can receive payments via escrows using a
          commercial bank as trustee, which they can claim by using a
          cryptographic proof which can be shared offline (e.g. via any
          messaging app).
        </Text>
        <SimpleGrid columns={[1, null, 2]} spacing="2">
          {useCases.map((useCase) => (
            <Box
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

export default UseCases;
