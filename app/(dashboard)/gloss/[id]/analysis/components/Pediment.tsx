import { GenericCard } from "@/app/components";

const Pediment = () => {
  // THE PDF WILL BE COME FROM THE DATABASE
  return (
    <GenericCard customClass="h-full">
      <iframe src="/pedimento_format.pdf" width="100%" height="100%" />
    </GenericCard>
  );
};

export default Pediment;
