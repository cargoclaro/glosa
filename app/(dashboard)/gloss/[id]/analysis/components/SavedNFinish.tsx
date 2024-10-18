import { GenericCard } from "@/app/components";
import formatCurrency from "@/app/utils/format-currency";
import { CurrencyDollar, RightArrow } from "@/public/icons";

const SavedNFinish = () => {
  return (
    <div className="flex flex-col gap-4">
      <GenericCard>
        <div className="flex justify-between gap-1">
          <p
            title={"+" + formatCurrency(5200, "MXN")}
            className="text-2xl font-bold truncate text-green-500"
          >
            {"+" + formatCurrency(5200, "MXN")}
          </p>
          <div className="h-full p-3 rounded-full bg-green-500 text-white">
            <CurrencyDollar />
          </div>
        </div>
        <small>Ahorrado en multas</small>
      </GenericCard>
      <div className="mx-auto">
        <button className="px-12 py-2 rounded-md border border-black text-sm relative group hover:bg-gray-100 transition-colors duration-200">
          Terminar
          <span className="absolute right-1 top-1.5 group-hover:animate-fade-right animate-infinite animate-duration-[2000ms] animate-alternate">
            <RightArrow />
          </span>
        </button>
      </div>
    </div>
  );
};

export default SavedNFinish;
