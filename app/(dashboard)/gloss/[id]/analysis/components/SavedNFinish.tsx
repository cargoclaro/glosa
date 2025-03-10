import Link from "next/link";
import { GenericCard } from "@/app/shared/components";
import formatCurrency from "@/app/shared/utils/format-currency";
import { CurrencyDollar, RightArrow } from "@/app/shared/icons";

interface ISavedNFinish {
  glossId: string;
  moneySaved: number;
}

const SavedNFinish = ({ glossId, moneySaved }: ISavedNFinish) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="mx-auto">
        <Link
          href={`/gloss/${glossId}`}
          className="px-12 py-2 rounded-md border border-black text-sm relative hover:bg-gray-100 transition-colors duration-200"
        >
          Terminar
          <span className="absolute right-1 top-1">
            <RightArrow />
          </span>
        </Link>
      </div>
    </div>
  );
};

export default SavedNFinish;
