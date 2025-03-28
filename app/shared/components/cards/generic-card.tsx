import { cn } from '~/lib/utils';

interface IGenericCard {
  customClass?: string;
  children: React.ReactNode;
}

const GenericCard = ({ customClass, children }: IGenericCard) => {
  return (
    <section
      className={cn(
        'rounded-2xl bg-white p-4 shadow-md ring-1 ring-gray-100 transition-shadow hover:shadow-lg',
        customClass
      )}
    >
      {children}
    </section>
  );
};

export default GenericCard;
