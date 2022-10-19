import { Icon } from "@chakra-ui/react";

export const Status = ({ isAvailable }: { isAvailable: boolean }) => {
  return (
    <Icon mr="1" opacity="0.8" boxSize="3" viewBox="0 0 200 200" color={isAvailable ? "green.500" : "red.500"}>
      <path
        fill="currentColor"
        d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
      />
    </Icon>
  );
};
