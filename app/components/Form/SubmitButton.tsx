import { cn } from "@/app/utils/cn";
import { Loading } from "@/app/components";

const colorMap: { [key: string]: string } = {
  red: "link-button-red",
  blue: "link-button-blue",
  green: "link-button-green",
  cargoClaro: "link-button-cargoClaro",
};

interface ISubmitButton {
  title: string;
  color?: string;
  pending: boolean;
}

const SubmitButton: React.FC<ISubmitButton> = ({
  title,
  pending,
  color = "cargoClaro",
}) => {
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(pending && "cursor-not-allowed", colorMap[color])}
    >
      {pending ? <Loading color={color} /> : title}
    </button>
  );
};

export default SubmitButton;
