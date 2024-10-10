"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/app/utils/cn";
import { usePathname } from "next/navigation";
import { GlobeAlt, Square2x2 } from "@/public/icons";

const Sidebar = () => {
  return (
    <aside className="fixed top-0 w-48 h-screen transition-transform -translate-x-full sm:translate-x-0 bg-white">
      <div className="h-full overflow-y-auto">
        <div className="size-auto my-10 pr-10">
          <Image
            src="/logo.webp"
            alt="Cargo Claro Logo"
            width={100}
            height={100}
            className="size-full"
          />
        </div>
        <ul className="space-y-2">
          <li>
            <LinkComp to="/auth/dashboard" span="Administración" icon="home" />
          </li>
          <li>
            <LinkComp to="/auth/gloss" span="Operaciones" icon="globe" />
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;

interface ILinkComp {
  to: string;
  span: string;
  icon: string;
}

const LinkComp = ({ to, span, icon }: ILinkComp) => {
  const pathname = usePathname();
  const isActive = pathname.startsWith(to);

  return (
    <Link href={to} className="flex group gap-1">
      <div
        className={cn(
          "w-1 h-auto group-hover:bg-cargoClaroOrange rounded-e-3xl",
          isActive && "bg-cargoClaroOrange"
        )}
      />
      <div
        className={cn(
          "w-full flex gap-2 py-2 px-4 group-hover:bg-cargoClaroOrange/30",
          isActive && "bg-cargoClaroOrange/30"
        )}
      >
        {icon === "home" ? <Square2x2 /> : <GlobeAlt strokeWidth={1} />}
        <span>{span}</span>
      </div>
    </Link>
  );
};
