// "use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { cn } from "@/app/shared/utils/cn";
import { useAuth, useModal } from "@/app/shared/hooks";
import { logout } from "@/app/shared/services/user/controller";
import { GlobeAlt, Square2x2, DoorArrowRight } from "@/app/shared/icons";
import type { IUser } from "@/app/shared/interfaces";

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
  } = useModal();

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
            <li className="block sm:hidden">
              <ProfileLink
                text="Administración"
                to="/home"
                onClick={toggleMenu}
                icon={<Square2x2 />}
              />
            </li>
            <li className="block sm:hidden">
              <ProfileLink
                to="/gloss"
                text="Operaciones"
                onClick={toggleMenu}
                icon={<GlobeAlt />}
              />
            </li>
            <li>
              <form action={logout}>
                <button
                  type="submit"
                  className="w-full flex gap-2 items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
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

interface IProfileLink {
  to: string;
  text: string;
  onClick: () => void;
  customClass?: string;
  icon: React.ReactNode;
}

const ProfileLink = ({
  to,
  onClick,
  text,
  customClass,
  icon,
}: IProfileLink) => {
  return (
    <Link
      href={to}
      className={cn(
        "flex gap-2 items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100",
        customClass
      )}
      onClick={onClick}
    >
      {icon}
      {text}
    </Link>
  );
};
