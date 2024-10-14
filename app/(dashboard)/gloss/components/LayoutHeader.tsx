"use client";

import Link from "next/link";
import { cn } from "@/app/utils/cn";
import { LeftArrow } from "@/public/icons";
import { usePathname } from "next/navigation";

const LayoutHeader = () => {
  const pathname = usePathname();
  return (
    <>
      <h1 className="text-2xl font-bold">
        <Link
          href="/gloss"
          className={cn(
            pathname !== "/gloss" && "inline-flex items-center gap-2"
          )}
        >
          <span>
            <LeftArrow
              strokeWidth={3}
              customClass={cn(pathname === "/gloss" && "hidden")}
            />
          </span>
          Mis Operaciones
        </Link>
      </h1>
    </>
  );
};

export default LayoutHeader;
