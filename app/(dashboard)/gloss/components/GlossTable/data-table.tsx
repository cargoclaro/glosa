'use client';

import {
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
      <h2 className="font-semibold text-2xl mb-6">Tus Expedientes</h2>
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
            className="h-12 w-full rounded-xl border border-gray-200 pr-4 pl-12 text-sm shadow-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none md:max-w-md"
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
            className="h-12 w-full appearance-none rounded-xl border border-gray-200 pl-12 pr-10 text-sm shadow-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
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
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/80">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b border-gray-200">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead 
                      key={header.id}
                      className="px-6 py-4 text-sm font-semibold text-gray-700"
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
                    "border-b border-gray-100 transition-colors hover:bg-orange-50/60 last:border-none cursor-pointer",
                    rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                  )}
                >
                  {row.getVisibleCells().map((cell) => {
                    // Special styling for operation status column
                    if (cell.column.id === 'operationStatus') {
                      const status = cell.getValue() as string;
                      return (
                        <TableCell key={cell.id} className="px-6 py-4">
                          <div 
                            className={cn(
                              "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
                              status === 'IN_PROGRESS' ? "bg-amber-100 text-amber-700 border border-amber-200" : 
                              status === 'DONE' ? "bg-green-100 text-green-700 border border-green-200" : 
                              "bg-gray-100 text-gray-700 border border-gray-200"
                            )}
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </div>
                        </TableCell>
                      );
                    }
                    
                    // Special styling for the action button column
                    if (cell.column.id === 'actions') {
                      return (
                        <TableCell key={cell.id} className="px-3 py-4 text-right">
                          <button
                            className="rounded-full bg-primary/10 p-2.5 text-primary hover:bg-orange-500 hover:text-white transition-all duration-200 hover:shadow-md"
                            aria-label="View details"
                          >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                        </TableCell>
                      );
                    }
                    
                    // Styling for the ID column (hash)
                    if (cell.column.id === 'id') {
                      return (
                        <TableCell key={cell.id} className="px-6 py-4">
                          <span className="font-mono text-xs text-gray-600">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </span>
                        </TableCell>
                      );
                    }
                    
                    return (
                      <TableCell key={cell.id} className="px-6 py-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <svg className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>No se encontraron expedientes</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-medium text-sm text-gray-700 order-2 sm:order-1">
          {`Página ${table.getState().pagination.pageIndex + 1} de ${table.getPageCount()}`}
        </p>
        <div className="flex items-center gap-2 order-1 sm:order-2">
          <div className="flex rounded-lg overflow-hidden border border-gray-200 shadow-sm">
            <button
              type="button"
              aria-label="Go to first page"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className={cn(
                'p-2.5 transition-all border-r border-gray-200',
                !table.getCanPreviousPage() ? 'cursor-not-allowed text-gray-300 bg-gray-50' : 'text-gray-700 hover:bg-gray-50'
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
                'p-2.5 transition-all border-r border-gray-200',
                !table.getCanPreviousPage() ? 'cursor-not-allowed text-gray-300 bg-gray-50' : 'text-gray-700 hover:bg-gray-50'
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
                'p-2.5 transition-all border-r border-gray-200',
                !table.getCanNextPage() ? 'cursor-not-allowed text-gray-300 bg-gray-50' : 'text-gray-700 hover:bg-gray-50'
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
                !table.getCanNextPage() ? 'cursor-not-allowed text-gray-300 bg-gray-50' : 'text-gray-700 hover:bg-gray-50'
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
