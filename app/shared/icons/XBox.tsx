import { cn } from "@/app/shared/utils/cn";
import type { IGenericIcon } from "@/app/shared/interfaces";

const XBoxIcon = ({
  size = "size-6",
  customClass = "",
  strokeWidth = 1.5,
  isFilled = false,
}: IGenericIcon) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={isFilled ? "currentColor" : "none"}
      viewBox="0 0 24 24"
      strokeWidth={strokeWidth}
      stroke="currentColor"
      className={cn(size, customClass)}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
      />
    </svg>
  );
};

export default XBoxIcon;
