import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Flex,
  HStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { CONFIEL_ROLES, DEFAULT_ROLE } from "../constants/roles";

export const NavBar = ({
  currentBankId,
  currentRole,
  setCurrentRole,
}: {
  currentBankId: string;
  currentRole: CONFIEL_ROLES;
  setCurrentRole: (role: CONFIEL_ROLES) => void;
}) => {
  useEffect(() => {
    setCurrentRole(DEFAULT_ROLE)
  }, [])
  return (
    <Box as="section" style={{ zIndex: 20 }}>
      <Box
        as="nav"
        bg="bg-surface"
        boxShadow={useColorModeValue("sm", "sm-dark")}
      >
        <Container py={{ base: "4", lg: "5" }}>
          <HStack spacing="10" justify="space-between">
            <Flex justify="center" flex="1">
              <ButtonGroup variant="link" spacing="8" mt="2">
                {Object.keys(CONFIEL_ROLES).map((item) => (
                  <Button
                    disabled={!currentBankId && (CONFIEL_ROLES[item] != CONFIEL_ROLES.CENTRAL_BANK)}
                    style={
                      CONFIEL_ROLES[item] == currentRole
                        ? { textDecoration: "underline" }
                        : {}
                    }
                    key={item}
                    size="sm"
                    onClick={() => setCurrentRole(CONFIEL_ROLES[item])}
                  >
                    {CONFIEL_ROLES[item]}
                  </Button>
                ))}
              </ButtonGroup>
            </Flex>
          </HStack>
        </Container>
      </Box>
    </Box>
  );
};
