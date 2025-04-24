import { RightArrow } from '@/shared/icons';
import Link from 'next/link';

interface ISavedNFinish {
  glossId: string;
  moneySaved: number;
}

const SavedNFinish = ({ glossId }: ISavedNFinish) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="mx-auto">
        <Link
          href={`/gloss/${glossId}`}
          className="relative flex items-center justify-center gap-2 rounded-lg border border-orange-200 bg-orange-50 px-12 py-2 font-medium text-orange-600 text-sm shadow-sm transition-colors duration-200 hover:bg-orange-100"
        >
          Terminar
          <span className="ml-1">
            <RightArrow
              size="size-4"
              strokeWidth={2}
              customClass="text-orange-500"
            />
          </span>
        </Link>
      </div>
    </div>
  );
};

export default SavedNFinish;
