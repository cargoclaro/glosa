import type { IGenericIcon } from '@/shared/interfaces';
import { cn } from '~/lib/utils';

const colorMap: { [key: string]: string } = {
  red: 'text-red-500',
  gray: 'text-gray-500',
  green: 'text-green-500',
};

interface IUpload extends IGenericIcon {
  color?: string;
}

const Upload = ({
  size = 'size-6',
  color = 'gray',
  customClass = '',
  strokeWidth = 1.5,
}: IUpload) => {
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 20 16"
      strokeWidth={strokeWidth}
      stroke="currentColor"
      className={cn(size, customClass, colorMap[color])}
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
      />
    </svg>
  );
};

export default Upload;
