"use client";

import { useState } from "react";
import { cn } from "@/app/shared/utils/cn";
import {
  Search,
  Funnel,
  LeftChevron,
  RightChevron,
  LeftDoubleChevron,
  RightDoubleChevron,
} from "@/app/shared/icons";
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from "@/app/shared/components/ui/table";
import {
  ColumnDef,
  flexRender,
  SortingState,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export default function GlossDataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      globalFilter,
      columnFilters,
    },
  });

  return (
    <section>
      <h2 className="text-xl font-semibold">Busca tus Expedientes</h2>
      <div className="flex flex-col md:flex-row gap-2 py-2">
        <div className="relative">
          <label
            htmlFor="globalFilter"
            className="absolute inset-y-0 start-0 flex items-center ps-3"
          >
            <Search size="size-4" customClass="text-gray-400" />
          </label>
          <input
            type="text"
            id="globalFilter"
            value={table.getState().globalFilter}
            placeholder="Buscar por nombre de importador"
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="w-full md:w-80 h-10 pl-10 pr-3 text-sm border rounded-md"
          />
        </div>
        <div className="relative">
          <label
            htmlFor="operationStatusSelect"
            className="absolute inset-y-0 start-0 flex items-center ps-3"
          >
            <Funnel size="size-4" customClass="text-gray-400" />
          </label>
          <select
            id="operationStatusSelect"
            aria-label="operationStatusSelect"
            className="w-full h-10 pl-10 text-sm border rounded-md"
            defaultValue={(() => {
              const filterValue = table.getColumn("operationStatus")?.getFilterValue();
              return typeof filterValue === "string" ? filterValue : "";
            })()}
            onChange={(event) =>
              table
                .getColumn("operationStatus")
                ?.setFilterValue(event.target.value)
            }
          >
            <option value="">Estado de la operación</option>
            <option value="IN_PROGRESS">Pendiente</option>
            <option value="DONE">Completado</option>
          </select>
        </div>
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="bg-white">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No se encontraron expedientes
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex justify-between gap-2 mt-4">
        <p className="text-sm font-medium">
          {"Página " +
            (table.getState().pagination.pageIndex + 1) +
            " de " +
            table.getPageCount()}
        </p>
        <div className="flex items-center justify-end space-x-2">
          <button
            aria-label="Go to first page"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className={cn(
              "p-2 text-white rounded-md",
              !table.getCanPreviousPage() && "bg-gray-300 cursor-not-allowed",
              table.getCanPreviousPage() &&
                "bg-cargoClaroOrange hover:bg-cargoClaroOrange-hover"
            )}
          >
            <LeftDoubleChevron />
          </button>
          <button
            aria-label="Go to previous page"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className={cn(
              "p-2 text-white rounded-md",
              !table.getCanPreviousPage() && "bg-gray-300 cursor-not-allowed",
              table.getCanPreviousPage() &&
                "bg-cargoClaroOrange hover:bg-cargoClaroOrange-hover"
            )}
          >
            <LeftChevron />
          </button>
          <button
            aria-label="Go to next page"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className={cn(
              "p-2 text-white rounded-md",
              !table.getCanNextPage() && "bg-gray-300 cursor-not-allowed",
              table.getCanNextPage() &&
                "bg-cargoClaroOrange hover:bg-cargoClaroOrange-hover"
            )}
          >
            <RightChevron />
          </button>
          <button
            aria-label="Go to last page"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className={cn(
              "p-2 text-white rounded-md",
              !table.getCanNextPage() && "bg-gray-300 cursor-not-allowed",
              table.getCanNextPage() &&
                "bg-cargoClaroOrange hover:bg-cargoClaroOrange-hover"
            )}
          >
            <RightDoubleChevron />
          </button>
        </div>
      </div>
    </section>
  );
}
