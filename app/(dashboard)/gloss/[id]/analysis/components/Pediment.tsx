import { GenericCard } from "@/app/shared/components";

const Pediment = ({ document }: { document: string }) => {
  return (
    <GenericCard customClass="h-[430px] md:h-[610px] lg:h-[890px]">
      <iframe width="100%" height="100%" title="Pedimento" src={document} />
    </GenericCard>
  );
};

export default Pediment;
