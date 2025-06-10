import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SignUp as ClerkSignUpForm } from '@clerk/nextjs';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { IconStar } from '@tabler/icons-react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Authentication forms built using the components.'
};

export default function SignUpViewPage() {
 return (
    <div className='relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
      {/* Lado esquerdo com fundo dark */}
      <div className='relative hidden h-full flex-col bg-zinc-900 p-10 text-gray-200 lg:flex dark:border-r'>
        <div className='absolute inset-0 bg-black opacity-80' />
        <div className='relative z-20 flex items-center text-lg font-semibold'>
          <Image
          src='/img/logo.png'
            alt='Logo da Plataforma Muffins AI'
            width={40}
            height={40}
            className='mr-2 rounded-full shadow-lg'
          />
          <span className='font-medium'>
            VoidPay{' '}
            <strong className='rounded-full border bg-white px-2 py-1 font-semibold text-zinc-900 shadow-sm'>
              Platform
            </strong>
          </span>
        </div>

        {/* Novo conteúdo central */}
        <div className='relative z-20 mx-auto mt-20 flex w-full max-w-md flex-col items-center'>
          <div className='mb-6 text-center'>
            <h2 className='mb-3 text-3xl font-bold text-primary'>
     Pagamentos Seguros
            </h2>
            <p className='text-gray-300'>
          Integração fácil, segurança garantida. Acesse a plataforma
            </p>
          </div>

          <div className='group relative h-56 w-full overflow-hidden rounded-xl border-2 border-yellow-400/20 shadow-2xl transition-all duration-300 hover:border-yellow-400/40 hover:shadow-yellow-400/10'>
            <Image
              src='/all/img2/op1.png'
              alt='Dashboard da Muffins AI mostrando análises em tempo real e ferramentas de IA'
              fill
              className='object-cover object-top transition-transform duration-500 group-hover:scale-105'
              quality={90}
              priority
            />
            <div className='absolute inset-0 bg-gradient-to-t from-zinc-900/70 via-zinc-900/30 to-transparent' />

            {/* Badge no canto inferior */}
            <div className='absolute right-4 bottom-4 rounded-full bg-accent px-3 py-1 text-xs font-bold text-zinc-900 backdrop-blur-sm'>
              NOVA VERSÃO
            </div>
          </div>
        </div>

       
      </div>
      {/* Lado direito com formulário */}
      <div className='flex h-full items-center justify-center bg-black p-4 lg:p-8'>
        <div className='flex w-full max-w-md flex-col items-center justify-center space-y-6'>
          {/* Formulário de autenticação */}
          <ClerkSignUpForm
            initialValues={{
              emailAddress: 'john@example.com'
            }}
          />
          <p className='px-8 text-center text-sm text-gray-400'>
            Ao clicar em continuar, você concorda com nossos{' '}
            <Link
              href='https://www.voidpay.online/terms'
              className='underline underline-offset-4 hover:text-yellow-400'
            >
              Termos de Serviço
            </Link>{' '}
            e nossa{' '}
            <Link
              href='https://www.voidpay.online/privacy'
              className='underline underline-offset-4 hover:text-yellow-400'
            >
              Política de Privacidade
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
