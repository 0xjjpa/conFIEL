import { useRef, useState } from "react";
import { Credential } from '@nodecfdi/credentials';
import {
  Link as ChakraLink,
  Text,
  Code,
  List,
  ListIcon,
  ListItem,
  Flex,
  IconButton,
  Button,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { ArrowUpIcon, CheckCircleIcon, LinkIcon } from "@chakra-ui/icons";

import { Hero } from "../components/Hero";
import { Container } from "../components/Container";
import { Main } from "../components/Main";
import { DarkModeSwitch } from "../components/DarkModeSwitch";
import { CTA } from "../components/CTA";
import { Footer } from "../components/Footer";
import { shorten } from "../lib/helpers";


const Index = () => {
  const [keyFilename, setKeyFilename] = useState("");
  const [cerFilename, setCerFilename] = useState("");
  const [privateKey, setPrivateKey] = useState<File>(undefined);
  const [certificate, setCertificate] = useState<File>(undefined);
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false);
  const hiddenFileInputKey = useRef(null);
  const hiddenFileInputCer = useRef(null);

  const handleChangeKey = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = (event.target as HTMLInputElement).files[0];
      setKeyFilename(shorten(file.name, 10, 10));
      setPrivateKey(file);
    }
  };

  const handleClickKey = () => {
    hiddenFileInputKey.current.click();
  };

  const handleChangeCer = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = (event.target as HTMLInputElement).files[0];
      setCerFilename(file.name);
      setCertificate(file);
    }
  };

  const handleChangePassword = (e) => setPassword(e.target.value)

  const handleClickCer = () => {
    hiddenFileInputCer.current.click();
  };

  const handleXRPGeneration = () => {
    setLoading(true);
    console.log("Start XRP generation...");
    //@TODO: Process Certificate on the browser side...
    const certReader = new FileReader()
    certReader.onload = (result) => {
      console.log("RESULT", result);
    }
    certReader.readAsBinaryString(certificate)
    console.log("Certificate", certificate);
    console.log("Key", privateKey);
    setTimeout(() => setLoading(false), 3000);
  }

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
        <Flex direction="row" justifyContent="space-between" alignItems="center">
          <Flex>
            <Text mr={2}>Upload <Code>.key</Code></Text>
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
          <Text fontSize="xs">{ keyFilename ? keyFilename : 'No private key selected.'}</Text>
        </Flex>
        <Flex direction="row" justifyContent="space-between" alignItems="center">
          <Flex>
            <Text mr={2}>Upload <Code>.cer</Code></Text>
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
          <Text fontSize="xs">{ cerFilename ? cerFilename : 'No certificate selected.'}</Text>
        </Flex>
        {
          privateKey && certificate && (
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
          )
        }
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
