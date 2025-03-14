import { XBoxIcon } from "@/app/shared/icons";

interface Card404Props {
  title: string;
  description: string;
}

const Card404 = ({ title, description }: Card404Props) => {
  return (
    <div className="p-4 text-center">
      <div className="w-full flex justify-center">
        <XBoxIcon size="size-20" />
      </div>
      <strong className="text-3xl">404. Not found</strong>
      <p className="text-2xl">{title}</p>
      <small className="text-xl">{description}</small>
    </div>
  );
};

export default Card404;
