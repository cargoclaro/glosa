'use client';

import {
  ClipboardDocumentList,
  Funnel,
  LeftChevron,
  LeftDoubleChevron,
  RightChevron,
  RightDoubleChevron,
  Search,
} from '@/shared/icons';
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
import { cn } from '~/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/ui/table';

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
    <section className="pb-8">
      <h2 className="mb-6 flex items-center gap-2 font-semibold text-2xl">
        <ClipboardDocumentList customClass="text-orange-500" size="size-7" />
        Tus Expedientes
      </h2>
      <div className="flex flex-col gap-4 py-4 md:flex-row">
        <div className="relative flex-1">
          <label
            htmlFor="globalFilter"
            className="absolute inset-y-0 start-0 flex items-center ps-4"
          >
            <Search size="size-5" customClass="text-gray-400" />
          </label>
          <input
            type="text"
            id="globalFilter"
            value={table.getState().globalFilter}
            placeholder="Buscar por nombre de importador"
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="h-12 w-full rounded-xl border border-gray-200 pr-4 pl-12 text-sm shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 md:max-w-md"
          />
        </div>
        <div className="relative">
          <label
            htmlFor="operationStatusSelect"
            className="absolute inset-y-0 start-0 flex items-center ps-4"
          >
            <Funnel size="size-5" customClass="text-gray-400" />
          </label>
          <select
            id="operationStatusSelect"
            aria-label="operationStatusSelect"
            className="h-12 w-full appearance-none rounded-xl border border-gray-200 pr-10 pl-12 text-sm shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
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
            <option value="">Estado de la glosa</option>
            <option value="IN_PROGRESS">Por glosar</option>
            <option value="DONE">Glosado</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
            <svg
              className="h-4 w-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50/80">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-gray-200 border-b"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="px-6 py-4 font-semibold text-gray-700 text-sm"
                    >
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
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, rowIndex) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={cn(
                    'cursor-pointer border-gray-100 border-b transition-colors last:border-none hover:bg-orange-50/60',
                    rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                  )}
                >
                  {row.getVisibleCells().map((cell) => {
                    // Special styling for operation status column
                    if (cell.column.id === 'operationStatus') {
                      return (
                        <TableCell key={cell.id} className="px-6 py-4">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      );
                    }

                    // Special styling for the action button column
                    if (cell.column.id === 'actions') {
                      return (
                        <TableCell
                          key={cell.id}
                          className="px-3 py-4 text-right"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      );
                    }

                    // Styling for the ID column (hash)
                    if (cell.column.id === 'id') {
                      return (
                        <TableCell key={cell.id} className="px-6 py-4">
                          <span className="font-mono text-gray-600 text-xs">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </span>
                        </TableCell>
                      );
                    }

                    return (
                      <TableCell key={cell.id} className="px-6 py-4">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-gray-500"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <svg
                      className="h-10 w-10 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p>No se encontraron expedientes</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="order-2 font-medium text-gray-700 text-sm sm:order-1">
          {`Página ${table.getState().pagination.pageIndex + 1} de ${table.getPageCount()}`}
        </p>
        <div className="order-1 flex items-center gap-2 sm:order-2">
          <div className="flex overflow-hidden rounded-lg border border-gray-200 shadow-sm">
            <button
              type="button"
              aria-label="Go to first page"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className={cn(
                'border-gray-200 border-r p-2.5 transition-all',
                table.getCanPreviousPage()
                  ? 'text-gray-700 hover:bg-gray-50'
                  : 'cursor-not-allowed bg-gray-50 text-gray-300'
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
                'border-gray-200 border-r p-2.5 transition-all',
                table.getCanPreviousPage()
                  ? 'text-gray-700 hover:bg-gray-50'
                  : 'cursor-not-allowed bg-gray-50 text-gray-300'
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
                'border-gray-200 border-r p-2.5 transition-all',
                table.getCanNextPage()
                  ? 'text-gray-700 hover:bg-gray-50'
                  : 'cursor-not-allowed bg-gray-50 text-gray-300'
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
                'p-2.5 transition-all',
                table.getCanNextPage()
                  ? 'text-gray-700 hover:bg-gray-50'
                  : 'cursor-not-allowed bg-gray-50 text-gray-300'
              )}
            >
              <RightDoubleChevron />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
