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
          className="relative rounded-md border border-black px-12 py-2 text-sm transition-colors duration-200 hover:bg-gray-100"
        >
          Terminar
          <span className="absolute top-1 right-1">
            <RightArrow />
          </span>
        </Link>
      </div>
    </div>
  );
};

export default SavedNFinish;
