import { ClientPage } from '@/components/app-component';
import { ClerkProvider } from '@clerk/nextjs';

type PageProps = { 
  params: { appId: string };
  children?: React.ReactNode;
};

export default function Page({ params, children }: PageProps) {
  return (
    <ClerkProvider>
      <html lang="es">
        <body>
          <ClientPage params={params} />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}