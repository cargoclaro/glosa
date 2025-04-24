'use client';

import { ArrowsUpDown } from '@/shared/icons';
import type { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { cn } from '~/lib/utils';

interface IDumpGlosses {
  id: string;
  importerName: string;
  operationStatus: string;
}

export const GlossDataTableColumns: ColumnDef<IDumpGlosses>[] = [
  {
    accessorKey: 'importerName',
    header: ({ column }) => {
      return (
        <button
          type="button"
          className="flex items-center gap-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nombre del importador
          <ArrowsUpDown size="size-4" />
        </button>
      );
    },
  },
  {
    accessorKey: 'operationStatus',
    header: ({ column }) => {
      return (
        <button
          type="button"
          className="flex items-center gap-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Estado de la glosa
          <ArrowsUpDown size="size-4" />
        </button>
      );
    },
    cell: ({ row }) => {
      // New cleaner status indicator inspired by Perplexity
      const isPending = row.getValue('operationStatus') === 'IN_PROGRESS';
      return (
        <div
          className={cn(
            'inline-flex items-center font-medium text-sm',
            isPending ? 'text-amber-600' : 'text-emerald-600'
          )}
        >
          <span
            className={cn(
              'mr-1.5 h-2 w-2 rounded-full',
              isPending ? 'bg-amber-500' : 'bg-emerald-500'
            )}
          />
          {isPending ? 'Por glosar' : 'Glosado'}
        </div>
      );
    },
  },
  {
    accessorKey: 'id', // UUID field, sorting is not allowed
    header: 'Número de Operación',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const id = row.getValue('id');
      return (
        <Link
          aria-label="View gloss report"
          href={`/gloss/${id}`}
          className="inline-flex items-center justify-center gap-1.5 rounded-md bg-orange-500 px-3 py-1.5 font-medium text-white text-xs transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
        >
          Ver
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="ml-0.5"
          >
            <path
              d="M9 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      );
    },
  },
];
