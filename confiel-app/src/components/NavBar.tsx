import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Flex,
  HStack,
  useColorModeValue,
} from "@chakra-ui/react";
import * as React from "react";

export const NavBar = () => {
  return (
    <Box as="section" pb={{ base: "12", md: "24" }}>
      <Box
        as="nav"
        bg="bg-surface"
        boxShadow={useColorModeValue("sm", "sm-dark")}
      >
        <Container py={{ base: "4", lg: "5" }}>
          <HStack spacing="10" justify="space-between">
            <Flex justify="center" flex="1">
              <ButtonGroup variant="link" spacing="8">
                {["User", "Bank"].map((item) => (
                  <Button key={item}>{item}</Button>
                ))}
              </ButtonGroup>
            </Flex>
          </HStack>
        </Container>
      </Box>
    </Box>
  );
};
