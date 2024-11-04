import { GenericCard } from "@/app/components";

const Pediment = () => {
  // THE PDF WILL BE COME FROM THE DATABASE
  return (
    <GenericCard customClass="h-full">
      <iframe
        width="100%"
        height="100%"
        title="Pedimento"
        src="/pedimento_format_modified.pdf"
      />
    </GenericCard>
  );
};

export default Pediment;
