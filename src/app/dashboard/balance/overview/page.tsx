import PageContainer from '@/components/layout/page-container';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { searchParamsCache } from '@/lib/searchparams';
import { cn } from '@/lib/utils';
import {
  IconArrowDown,
  IconArrowUp,
  IconCash,
  IconClock,
  IconCurrencyDollar,
  IconHistory,
  IconPlus,
  IconRefresh,
  IconTransfer
} from '@tabler/icons-react';
import Link from 'next/link';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';

export const metadata = {
  title: 'Dashboard: Saldos',
  description: 'Gerencie seus saldos e transferências'
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  // Dados mockados - substituir por chamadas à API
  const balances = {
    available: 12500.50,
    pending: 3200.75,
    total: 15701.25,
    lastPayout: '2023-11-15'
  };

  const transactions = [
    { id: 1, date: '2023-11-15', amount: 5000.00, type: 'payout', status: 'completed' },
    { id: 2, date: '2023-11-10', amount: 250.50, type: 'payment', status: 'completed' },
    { id: 3, date: '2023-11-08', amount: 1200.00, type: 'payment', status: 'pending' }
  ];

  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <div>
            <Heading
              title='Saldos'
              description='Gerencie seus saldos e transferências'
            />
          </div>
          <div className='flex gap-2'>
            <Button variant="outline" className='text-xs md:text-sm'>
              <IconRefresh className='mr-2 h-4 w-4' /> Atualizar
            </Button>
            <Link
              href='/dashboard/transactions/payouts/request'
              className={cn(buttonVariants(), 'text-xs md:text-sm')}
            >
              <IconPlus className='mr-2 h-4 w-4' /> Solicitar Saque
            </Link>
          </div>
        </div>
        <Separator />

        {/* Cartões de Saldos */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium'>Disponível</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(balances.available)}
              </div>
              <p className='text-muted-foreground text-xs'>Valor para saque imediato</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className='w-full'>
                <IconArrowUp className='mr-2 h-4 w-4' /> Transferir
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium'>Pendente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(balances.pending)}
              </div>
              <p className='text-muted-foreground text-xs'>A liberar em 7 dias</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className='w-full' disabled>
                <IconClock className='mr-2 h-4 w-4' /> Aguardando
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium'>Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(balances.total)}
              </div>
              <p className='text-muted-foreground text-xs'>Último saque: {new Date(balances.lastPayout).toLocaleDateString()}</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className='w-full'>
                <IconHistory className='mr-2 h-4 w-4' /> Histórico
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Seção de Transações Recentes */}
        <Card>
          <CardHeader>
            <CardTitle>Transações Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {transactions.map((tx) => (
                <div key={tx.id} className='flex items-center justify-between border-b pb-3'>
                  <div className='flex items-center space-x-4'>
                    <div className={cn(
                      'rounded-full p-3',
                      tx.type === 'payment' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                    )}>
                      {tx.type === 'payment' ? (
                        <IconCurrencyDollar className='h-5 w-5' />
                      ) : (
                        <IconArrowDown className='h-5 w-5' />
                      )}
                    </div>
                    <div>
                      <p className='font-medium'>
                        {tx.type === 'payment' ? 'Pagamento recebido' : 'Saque realizado'}
                      </p>
                      <p className='text-muted-foreground text-sm'>{new Date(tx.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className={cn(
                    'font-medium',
                    tx.type === 'payment' ? 'text-green-600' : 'text-blue-600'
                  )}>
                    {tx.type === 'payment' ? '+' : '-'}
                    {new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(tx.amount)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className='justify-center'>
            <Button variant="ghost">
              Ver todas as transações
            </Button>
          </CardFooter>
        </Card>

        {/* Tabela de Saques (pode ser substituída por um componente DataTable real) */}
        <Suspense
          fallback={
            <DataTableSkeleton
              columnCount={5}
              rowCount={5}
              filterCount={2}
            />
          }
        >
          {/* Componente de tabela de saques aqui */}
          <div className='rounded-lg border p-4'>
            <h3 className='mb-4 text-lg font-semibold'>Histórico de Saques</h3>
            <p className='text-muted-foreground text-sm'>A implementar - tabela de saques</p>
          </div>
        </Suspense>
      </div>
    </PageContainer>
  );
}