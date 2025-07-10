import { ClientPage } from '@/components/app-component';
type PageProps = { params: Promise<{ appId: string }> };
export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  return <ClientPage params={resolvedParams} />;
}
