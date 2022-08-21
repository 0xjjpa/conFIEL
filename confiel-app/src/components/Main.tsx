import { Stack, StackProps } from "@chakra-ui/react";

export const Main = (props: StackProps) => (
  <Stack
    bg="gray.50"
    color="black"
    _dark={{
      bg: "gray.900",
      color: "white",
    }}
    spacing="1.5rem"
    width="100%"
    maxWidth="48rem"
    mt="-25vh"
    pt="8rem"
    px="1rem"
    {...props}
  />
);
