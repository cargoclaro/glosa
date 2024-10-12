import { cn } from "@/app/utils/cn";

interface IGenericCard {
  customClass?: string;
  children: React.ReactNode;
}

const GenericCard = ({ customClass, children }: IGenericCard) => {
  return (
    <section className={cn("bg-white p-4 rounded-2xl shadow-md", customClass)}>
      {children}
    </section>
  );
};

export default GenericCard;
