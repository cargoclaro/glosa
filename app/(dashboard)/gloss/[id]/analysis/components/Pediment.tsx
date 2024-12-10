import { GenericCard } from "@/app/components";

const Pediment = ({ document }: { document: string }) => {
  return (
    <GenericCard customClass="h-full">
      <iframe width="100%" height="100%" title="Pedimento" src={document} />
    </GenericCard>
  );
};

export default Pediment;
