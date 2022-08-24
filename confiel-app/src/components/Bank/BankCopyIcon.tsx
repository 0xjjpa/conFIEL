import { CheckIcon, CopyIcon } from "@chakra-ui/icons";
import { useClipboard, IconButton } from "@chakra-ui/react";
import { useState } from "react";

export const BankCopyIcon = ({ address }: {address: string}) => {
  const [ copiedAddress ] = useState(address);
  const { hasCopied, onCopy } = useClipboard(copiedAddress);
  return (
    <IconButton
      onClick={onCopy}
      ml="1"
      variant="ghost"
      aria-label="Copy address"
      icon={hasCopied ? <CheckIcon /> : <CopyIcon />}
    />
  );
};
