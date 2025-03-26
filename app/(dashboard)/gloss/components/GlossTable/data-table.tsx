'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import {
  Funnel,
  LeftChevron,
  LeftDoubleChevron,
  RightChevron,
  RightDoubleChevron,
  Search,
} from '@/shared/icons';
import { cn } from '@/shared/utils/cn';
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export default function GlossDataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [globalFilter, setGlobalFilter] = useState('');
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
      <h2 className="font-semibold text-xl">Busca tus Expedientes</h2>
      <div className="flex flex-col gap-2 py-2 md:flex-row">
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
            className="h-10 w-full rounded-md border pr-3 pl-10 text-sm md:w-80"
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
            className="h-10 w-full rounded-md border pl-10 text-sm"
            defaultValue={(() => {
              const filterValue = table
                .getColumn('operationStatus')
                ?.getFilterValue();
              return typeof filterValue === 'string' ? filterValue : '';
            })()}
            onChange={(event) =>
              table
                .getColumn('operationStatus')
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
                data-state={row.getIsSelected() && 'selected'}
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
      <div className="mt-4 flex justify-between gap-2">
        <p className="font-medium text-sm">
          {`Página ${table.getState().pagination.pageIndex + 1} de ${table.getPageCount()}`}
        </p>
        <div className="flex items-center justify-end space-x-2">
          <button
            type="button"
            aria-label="Go to first page"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className={cn(
              'rounded-md p-2 text-white',
              !table.getCanPreviousPage() && 'cursor-not-allowed bg-gray-300',
              table.getCanPreviousPage() && 'bg-primary hover:bg-primary/80'
            )}
          >
            <LeftDoubleChevron />
          </button>
          <button
            type="button"
            aria-label="Go to previous page"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className={cn(
              'rounded-md p-2 text-white',
              !table.getCanPreviousPage() && 'cursor-not-allowed bg-gray-300',
              table.getCanPreviousPage() && 'bg-primary hover:bg-primary/80'
            )}
          >
            <LeftChevron />
          </button>
          <button
            type="button"
            aria-label="Go to next page"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className={cn(
              'rounded-md p-2 text-white',
              !table.getCanNextPage() && 'cursor-not-allowed bg-gray-300',
              table.getCanNextPage() && 'bg-primary hover:bg-primary/80'
            )}
          >
            <RightChevron />
          </button>
          <button
            type="button"
            aria-label="Go to last page"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className={cn(
              'rounded-md p-2 text-white',
              !table.getCanNextPage() && 'cursor-not-allowed bg-gray-300',
              table.getCanNextPage() && 'bg-primary hover:bg-primary/80'
            )}
          >
            <RightDoubleChevron />
          </button>
        </div>
      </div>
    </section>
  );
}
