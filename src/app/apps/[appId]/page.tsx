import { ClientPage } from '@/components/app-component';

export default async function Page({ params }: { params: { appId: string } }) {
  return <ClientPage params={params} />;
}
