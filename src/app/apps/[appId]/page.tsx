import { ClientPage } from '@/components/app-component';
type PageProps = { params: Promise<{ appId: string }> };
export default async function Page({ params }: PageProps) {
  return <ClientPage params={params} />;
}
