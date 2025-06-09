import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import AppCredentialsModal from '@/features/apps/components/app-credentials-modal';
import AppsListingPage from '@/features/apps/components/app-listing';
import { searchParamsCache, serialize } from '@/lib/searchparams';
import { cn } from '@/lib/utils';
import {
  IconKey,
  IconPlus,
  IconShieldLock,
  IconWebhook
} from '@tabler/icons-react';
import Link from 'next/link';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';

export const metadata = {
  title: 'Dashboard: Apps & Credentials'
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <div>
            <Heading
              title='Apps & Credentials'
              description='Manage your payment gateway integrations and API credentials'
            />
            <div className='mt-2 flex gap-2'>
              <span className='text-muted-foreground inline-flex items-center gap-1 text-xs'>
                <IconShieldLock className='h-3 w-3' /> Secure connection
              </span>
              <span className='text-muted-foreground inline-flex items-center gap-1 text-xs'>
                <IconWebhook className='h-3 w-3' /> Webhook ready
              </span>
            </div>
          </div>
          <div className='flex gap-2'>
            <AppCredentialsModal>
              <button
                className={cn(
                  buttonVariants({ variant: 'outline' }),
                  'text-xs md:text-sm'
                )}
              >
                <IconKey className='mr-2 h-4 w-4' /> API Docs
              </button>
            </AppCredentialsModal>
            <Link
              href='/dashboard/apps/new'
              className={cn(buttonVariants(), 'text-xs md:text-sm')}
            >
              <IconPlus className='mr-2 h-4 w-4' /> New App
            </Link>
          </div>
        </div>
        <Separator />

        {/* Stats Cards Row */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
          <div className='rounded-lg border p-4'>
            <h3 className='text-sm font-medium'>Active Apps</h3>
            <p className='text-2xl font-bold'>12</p>
            <p className='text-muted-foreground text-xs'>+2 this month</p>
          </div>
          <div className='rounded-lg border p-4'>
            <h3 className='text-sm font-medium'>API Requests</h3>
            <p className='text-2xl font-bold'>1.2M</p>
            <p className='text-muted-foreground text-xs'>98% success rate</p>
          </div>
          <div className='rounded-lg border p-4'>
            <h3 className='text-sm font-medium'>Credentials Expiring</h3>
            <p className='text-2xl font-bold'>3</p>
            <p className='text-muted-foreground text-xs'>in next 30 days</p>
          </div>
        </div>

        <Suspense
          fallback={
            <DataTableSkeleton
              columnCount={6}
              rowCount={8}
              filterCount={3}
              //   filterPlaceholders={['Search apps...', 'Status', 'Environment']}
            />
          }
        >
          <AppsListingPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
