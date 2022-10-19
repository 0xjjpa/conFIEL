import { CentralBankList } from "./CentralBankList";

export const CentralBankView = ({ selectBank }: { selectBank: () => void }) => {
  return (
    <>
      <CentralBankList selectBank={selectBank}/>
    </>
  );
};
