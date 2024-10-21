"use client";

import Link from "next/link";
import { cn } from "@/app/utils/cn";
import { LeftArrow } from "@/public/icons";
import { usePathname } from "next/navigation";

const LayoutHeader = () => {
  const pathname = usePathname();
  const isAnalysis = pathname.endsWith("/analysis");

  return (
    <h1
      className={cn(
        "text-2xl font-bold",
        (pathname === "/gloss" || isAnalysis) && "hidden"
      )}
    >
      <Link className="inline-flex items-center gap-2" href="/gloss">
        <span>
          <LeftArrow strokeWidth={3} />
        </span>
        Mis Operaciones
      </Link>
    </h1>
  );
};

export default LayoutHeader;
