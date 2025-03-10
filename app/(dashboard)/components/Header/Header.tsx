"use client";

import { cn } from "@/app/shared/utils/cn";
import ProfileMenu from "./ProfileMenu";
import todayIs from "@/app/shared/utils/today-is";
// import NotificationsMenu from "./NotificationsMenu";
import { usePathname } from "next/navigation";
import { Prisma } from "@prisma/client";

type User = Prisma.UserGetPayload<{
  include: {
    glosses: true;
  };
}>;

interface IHeader {
  user: User;
  // notifications: object;
}

const Header = ({
  user,
}: // notifications
IHeader) => {
  const pathname = usePathname();
  const isAnalysisPage = pathname.endsWith("analysis");
  return (
    <header
      className={cn(
        "sticky top-0 z-10 bg-[#f8f9fd]",
        isAnalysisPage && "hidden"
      )}
    >
      <nav className="sm:ml-48 p-4">
        <ul className="w-full flex justify-between items-center gap-4">
          <li className="flex flex-col gap-0">
            <p className="font-semibold">
              Bienvenido, {user.name + " " + user.lastName}
            </p>
            <small className="text-gray-500">{todayIs(new Date())}</small>
          </li>
          <li>
            <ul className="flex gap-4">
              {/* <li className="flex items-center">
                <NotificationsMenu notifications={notifications} />
              </li> */}
              <li className="flex gap-2 items-center">
                <ProfileMenu user={user} />
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
