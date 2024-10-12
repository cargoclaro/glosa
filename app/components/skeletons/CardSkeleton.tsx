// import { UserIcon } from "@/public/icons";
import Image from "next/image";

const CardSkeleton = () => {
  return (
    <div className="flex flex-col justify-between w-full bg-white rounded-lg shadow-md p-6 animate-pulse">
      <div className="flex flex-col justify-between items-center gap-2 mb-4">
        <div className="h-3 bg-gray-300 rounded-full w-32 mb-3"></div>
        {/* <UserIcon customClass="w-20 h-20 text-gray-200" /> */}
        <div className="flex items-center size-20 rounded-full opacity-50">
          <Image
            alt="Profile"
            src="/profilepic.webp"
            width={80}
            height={80}
            className="size-full object-cover rounded-full"
          />
        </div>
      </div>
      <div className="h-4 bg-gray-300 rounded-full w-64"></div>
      <div className="flex gap-2 mt-2">
        <div className="h-3 bg-gray-300 rounded-full w-36"></div>
        <div className="flex flex-col gap-2">
          <div className="h-3 bg-gray-300 rounded-full w-32"></div>
          <div className="h-3 bg-gray-300 rounded-full w-44"></div>
          <div className="h-3 bg-gray-300 rounded-full w-16"></div>
          <div className="h-3 bg-gray-300 rounded-full w-32"></div>
        </div>
      </div>
    </div>
  );
};

export default CardSkeleton;
