import { List, ListItem, ListIcon, Text } from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import Image from "next/image";
import { BANKS } from "../../constants/banks";
import { CommercialBankListItem } from "./CommercialBankListItem";

export const CentralBankList = ({ selectBank }: { selectBank: () => void }) => {
  return (
    <>
      <List spacing={3}>
        {BANKS.map((bank) => (
          <CommercialBankListItem
            id={bank.id}
            icon={bank.icon}
            name={bank.name}
            longName={bank.longName}
            selectBank={selectBank}
          />
        ))}
      </List>
    </>
  );
};
