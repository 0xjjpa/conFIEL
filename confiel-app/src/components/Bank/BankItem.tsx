import Image from "next/image";
import { Text, useMediaQuery } from "@chakra-ui/react";
import { Bank } from "../../types/Banks";

export const BankItem = ({ bank }: { bank: Bank }) => {
  const [isLargerThan1280] = useMediaQuery("(min-width: 480px)");
  return (
    <>
      <Image src={bank.icon.url} width={bank.icon.width} height={bank.icon.height} />
      <Text ml="2" color="black.500">
        {bank.name}
      </Text>
      {isLargerThan1280 && (
        <Text fontSize="xs" ml="2" color="gray.600">
          {bank.longName}
        </Text>
      )}
    </>
  );
};
