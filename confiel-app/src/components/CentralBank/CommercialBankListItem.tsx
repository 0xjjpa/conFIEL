import { Flex, ListItem, Text, useMediaQuery } from "@chakra-ui/react";
import Image from "next/image";
import { CommercialBankAccount } from "./CommercialBankAccount";

export const CommercialBankListItem = ({
  icon,
  name,
  longName,
}: {
  icon: { url: string; width: number; height: number };
  name: string;
  longName: string;
}) => {
  const [isLargerThan1280] = useMediaQuery("(min-width: 480px)");
  return (
    <ListItem>
      <Flex alignItems="center" justifyContent="space-between">
        <Flex alignItems="center">
          <Image src={icon.url} width={icon.width} height={icon.height} />
          <Text ml="2" color="gray.300">
            {name}
          </Text>
          {isLargerThan1280 && (
            <Text fontSize="xs" ml="2" color="gray.600">
              {longName}
            </Text>
          )}
        </Flex>
        <CommercialBankAccount />
      </Flex>
    </ListItem>
  );
};
