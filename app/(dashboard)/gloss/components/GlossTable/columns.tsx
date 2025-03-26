'use client';

import { ArrowsUpDown, RightArrow } from '@/shared/icons';
import { cn } from '@/shared/utils/cn';
import type { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

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
          Estado de la operación
          <ArrowsUpDown size="size-4" />
        </button>
      );
    },
    cell: ({ row }) => {
      return (
        <p
          className={cn(
            row.getValue('operationStatus') === 'IN_PROGRESS'
              ? 'max-w-min rounded-full border border-yellow-700 bg-yellow-50 px-4 py-2 text-yellow-700'
              : 'max-w-min rounded-full border border-green-700 bg-green-50 px-4 py-2 text-green-700'
          )}
        >
          {row.getValue('operationStatus') === 'IN_PROGRESS'
            ? 'Pendiente'
            : 'Completado'}
        </p>
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
      return (
        <Link
          aria-label="View gloss report"
          href={`/gloss/${row.getValue('id')}`}
          className="line-clamp-1 max-w-max rounded-xl bg-cargoClaroOrange p-2 text-white hover:bg-cargoClaroOrange/80"
        >
          <RightArrow size="size-4" strokeWidth={4} />
        </Link>
      );
    },
  },
];
