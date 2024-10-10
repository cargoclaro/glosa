"use client";

// import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
// import { cn } from "@/app/utils/cn";
import { useAuth, useToggleMenu } from "@/app/hooks";
import {
  // Cog8,
  // UserIcon
  DoorArrowRight,
} from "@/public/icons";
import type { IUser } from "@/app/interfaces";
import { logout } from "@/app/services/user/controller";

interface IProfileMenu {
  user: IUser;
}

const ProfileMenu = ({ user }: IProfileMenu) => {
  const { setUser } = useAuth();
  const {
    isOpen: isMenuOpen,
    toggleMenu,
    // closeMenu,
    menuRef,
  } = useToggleMenu();

  useEffect(() => {
    setUser(user);
  }, [user, setUser]);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        onClick={toggleMenu}
        className="flex items-center size-10 rounded-full"
      >
        <Image
          alt="Profile"
          src={user.image}
          width={40}
          height={40}
          className="size-full object-cover rounded-full"
        />
      </button>
      {isMenuOpen && (
        <div
          aria-roledescription="menu"
          className="bg-white z-20 origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow"
        >
          <ul>
            {/* <li>
              <ProfileLink
                text="Perfil"
                to="/auth/profile"
                onClick={toggleMenu}
                icon={<UserIcon isFilled />}
              />
            </li>
            <li>
              <ProfileLink
                to="/auth/settings"
                text="Configuración"
                onClick={toggleMenu}
                icon={<Cog8 strokeWidth={2} />}
              />
            </li> */}
            <li>
              <form action={logout}>
                <button
                  type="submit"
                  className="w-full flex gap-2 items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <DoorArrowRight />
                  Cerrar sesión
                </button>
              </form>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;

// interface IProfileLink {
//   to: string;
//   text: string;
//   onClick: () => void;
//   customClass?: string;
//   icon: React.ReactNode;
// }

// const ProfileLink = ({
//   to,
//   onClick,
//   text,
//   customClass,
//   icon,
// }: IProfileLink) => {
//   return (
//     <Link
//       href={to}
//       className={cn(
//         "flex gap-2 items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100",
//         customClass
//       )}
//       onClick={onClick}
//     >
//       {icon}
//       {text}
//     </Link>
//   );
// };
