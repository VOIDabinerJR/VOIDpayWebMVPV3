'use client';

import { ColumnDef } from '@tanstack/react-table';
import { App } from '@/constants/data';
import { Badge } from '@/components/ui/badge';
import { IconCheck, IconX, IconClock, IconWorld } from '@tabler/icons-react';
import { ReactNode } from 'react';

export const columns: ColumnDef<App>[] = [
  {
    accessorKey: 'name',
    header: 'Application',
    cell: ({ row }) => (
      <div className='flex flex-col'>
        <span className='font-medium'>{row.getValue('name')}</span>
        <span className='text-muted-foreground text-xs'>
          {row.original.description}
        </span>
      </div>
    )
  },
  {
    accessorKey: 'client_id',
    header: 'Client ID',
    cell: ({ row }) => (
      <div className='font-mono text-sm'>{row.getValue('client_id')}</div>
    )
  },
  {
    accessorKey: 'environment',
    header: 'Environment',
    cell: ({ row }) => (
      <Badge
        variant={
          row.getValue('environment') === 'production' ? 'default' : 'secondary'
        }
        className='flex items-center gap-1'
      >
        {row.getValue('environment') === 'production' ? (
          <IconWorld className='h-3 w-3' />
        ) : (
          <IconClock className='h-3 w-3' />
        )}
        {row.getValue('environment')}
      </Badge>
    )
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status');
      const variant =
        status === 'active'
          ? 'default' // Update this line to use a valid variant
          : status === 'suspended'
            ? 'destructive'
            : 'secondary';

      return (
        <Badge variant={variant}>
          {status === 'active' && <IconCheck className='mr-1 h-3 w-3' />}
          {status === 'suspended' && <IconX className='mr-1 h-3 w-3' />}
          {status as ReactNode}
        </Badge>
      );
    }
  },
  {
    accessorKey: 'last_used',
    header: 'Last Used',
    cell: ({ row }) => (
      <div className='text-sm'>
        {row.original.last_used
          ? new Date(row.original.last_used).toLocaleDateString()
          : 'Never'}
      </div>
    )
  }
  // Adicione mais colunas conforme necessário
];
