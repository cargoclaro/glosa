"use client";

import Link from "next/link";
import { cn } from "@/shared/utils/cn";
import { ColumnDef } from "@tanstack/react-table";
import { RightArrow, ArrowsUpDown } from "@/shared/icons";

interface IDumpGlosses {
  id: string;
  importerName: string;
  operationStatus: string;
}

export const GlossDataTableColumns: ColumnDef<IDumpGlosses>[] = [
  {
    accessorKey: "importerName",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nombre del importador
          <ArrowsUpDown size="size-4" />
        </button>
      );
    },
  },
  {
    accessorKey: "operationStatus",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Estado de la operación
          <ArrowsUpDown size="size-4" />
        </button>
      );
    },
    cell: ({ row }) => {
      return (
        <p
          className={cn(
            row.getValue("operationStatus") === "IN_PROGRESS"
              ? "px-4 py-2 max-w-min rounded-full bg-yellow-50 text-yellow-700 border border-yellow-700"
              : "px-4 py-2 max-w-min rounded-full bg-green-50 text-green-700 border border-green-700"
          )}
        >
          {row.getValue("operationStatus") === "IN_PROGRESS"
            ? "Pendiente"
            : "Completado"}
        </p>
      );
    },
  },
  {
    accessorKey: "id", // UUID field, sorting is not allowed
    header: "Número de Operación",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <Link
          aria-label="View gloss report"
          href={`/gloss/${row.getValue("id")}`}
          className="p-2 max-w-max line-clamp-1 rounded-xl text-white bg-cargoClaroOrange hover:bg-cargoClaroOrange-hover"
        >
          <RightArrow size="size-4" strokeWidth={4} />
        </Link>
      );
    },
  },
];
