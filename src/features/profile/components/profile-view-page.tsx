// components/pro-account-profile.tsx
'use client';

import { useUser, useClerk } from '@clerk/nextjs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import PageContainer from '@/components/layout/page-container';
/* The above code is importing three icons - CreditCardIcon, QrCodeIcon, and BanknoteIcon - from a
custom icons component. The comment indicates that the import should be adjusted according to the
system of icons being used. */
// import { CreditCardIcon, QrCodeIcon, BanknoteIcon } from '@/components/icons'; // Ajuste conforme seu sistema de ícones
import { CreditCardIcon, QrCodeIcon, BanknoteIcon } from 'lucide-react';
// Tipos para métodos de pagamento
type PaymentMethod = {
  id: string;
  type: 'card' | 'pix' | 'bank_account';
  details: string;
  isDefault: boolean;
};

export function ProAccountProfile() {
  const { user } = useUser();
  const { signOut } = useClerk();

  // Dados mockados - substitua pela sua API real
  const paymentMethods: PaymentMethod[] = [
    {
      id: '1',
      type: 'card',
      details: 'Cartão Mastercard **** 4242',
      isDefault: true
    },
    {
      id: '2',
      type: 'pix',
      details: 'Chave: 123.456.789-00',
      isDefault: false
    },
    {
      id: '3',
      type: 'bank_account',
      details: 'Banco: 341 - Ag: 1234 CC: 56789-0',
      isDefault: false
    }
  ];

  if (!user) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='border-primary h-12 w-12 animate-spin rounded-full border-t-2 border-b-2' />
      </div>
    );
  }

  return (
    <PageContainer>
      <div className='mx-auto w-full max-w-6xl space-y-6 p-4'>
        <div className='flex items-start justify-between'>
          <div className='flex items-center space-x-4'>
            <Avatar className='h-20 w-20'>
              <AvatarImage src={user.imageUrl} />
              <AvatarFallback className='text-2xl font-bold'>
                {user.firstName?.charAt(0)}
                {user.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className='text-2xl font-bold'>
                {user.firstName} {user.lastName}
              </h1>
              <p className='text-muted-foreground'>
                {user.primaryEmailAddress?.emailAddress}
              </p>
              <Badge variant='outline' className='mt-2'>
                Conta Empresarial
              </Badge>
            </div>
          </div>
          <Button variant='outline' onClick={() => signOut()}>
            Sair
          </Button>
        </div>

        <Tabs defaultValue='profile' className='w-full'>
          <TabsList className='grid w-full grid-cols-4'>
            <TabsTrigger value='profile'>Perfil</TabsTrigger>
            <TabsTrigger value='payments'>Pagamentos</TabsTrigger>
            <TabsTrigger value='security'>Segurança</TabsTrigger>
            <TabsTrigger value='preferences'>Preferências</TabsTrigger>
          </TabsList>

          {/* ABA PERFIL */}
          <TabsContent value='profile'>
            <div className='grid gap-4 md:grid-cols-2'>
              <Card>
                <CardHeader>
                  <CardTitle>Informações Pessoais</CardTitle>
                  <CardDescription>Atualize seus dados básicos</CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='grid grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='firstName'>Nome</Label>
                      <Input
                        id='firstName'
                        defaultValue={user.firstName || ''}
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='lastName'>Sobrenome</Label>
                      <Input id='lastName' defaultValue={user.lastName || ''} />
                    </div>
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='email'>Email</Label>
                    <Input
                      id='email'
                      defaultValue={
                        user.primaryEmailAddress?.emailAddress || ''
                      }
                      disabled
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='phone'>Telefone</Label>
                    <Input
                      id='phone'
                      defaultValue={user.primaryPhoneNumber?.phoneNumber || ''}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Salvar alterações</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Informações Empresariais</CardTitle>
                  <CardDescription>Dados da sua empresa</CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='companyName'>Nome da Empresa</Label>
                    <Input id='companyName' defaultValue='Minha Empresa LTDA' />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='cnpj'>CNPJ</Label>
                    <Input id='cnpj' defaultValue='12.345.678/0001-99' />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='industry'>Setor</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder='Selecione o setor' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='tech'>Tecnologia</SelectItem>
                        <SelectItem value='retail'>Varejo</SelectItem>
                        <SelectItem value='services'>Serviços</SelectItem>
                        <SelectItem value='other'>Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Atualizar dados</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          {/* ABA PAGAMENTOS */}
          <TabsContent value='payments'>
            <Card>
              <CardHeader>
                <CardTitle>Métodos de Pagamento</CardTitle>
                <CardDescription>
                  Gerencie suas formas de pagamento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className='flex items-center justify-between rounded-lg border p-4'
                    >
                      <div className='flex items-center space-x-4'>
                        <div className='bg-secondary rounded-md p-2'>
                          {method.type === 'card' && (
                            <CreditCardIcon className='text-primary h-5 w-5' />
                          )}
                          {method.type === 'pix' && (
                            <QrCodeIcon className='text-primary h-5 w-5' />
                          )}
                          {method.type === 'bank_account' && (
                            <BanknoteIcon className='text-primary h-5 w-5' />
                          )}
                        </div>
                        <div>
                          <p className='font-medium'>{method.details}</p>
                          <p className='text-muted-foreground text-sm'>
                            {method.type === 'card'
                              ? 'Cartão de crédito'
                              : method.type === 'pix'
                                ? 'Chave PIX'
                                : 'Conta bancária'}
                          </p>
                        </div>
                      </div>
                      <div className='flex items-center space-x-2'>
                        {method.isDefault && (
                          <Badge variant='secondary'>Padrão</Badge>
                        )}
                        <Button variant='ghost' size='sm'>
                          Editar
                        </Button>
                        {!method.isDefault && (
                          <Button variant='ghost' size='sm'>
                            Remover
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className='flex flex-col items-start gap-4'>
                <Button>Adicionar método de pagamento</Button>
                <div className='text-muted-foreground text-sm'>
                  <p>Tipos de pagamento aceitos:</p>
                  <ul className='mt-2 list-disc space-y-1 pl-5'>
                    <li>Cartões de crédito (Visa, Mastercard, etc.)</li>
                    <li>PIX (Chave CPF/CNPJ, Email, Telefone)</li>
                    <li>Transferência bancária</li>
                  </ul>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* ABA SEGURANÇA */}
          <TabsContent value='security'>
            <div className='grid gap-6 md:grid-cols-2'>
              <Card>
                <CardHeader>
                  <CardTitle>Segurança da Conta</CardTitle>
                  <CardDescription>
                    Proteja sua conta com medidas adicionais
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='space-y-2'>
                    <Label>Autenticação de Dois Fatores (2FA)</Label>
                    <div className='flex items-center justify-between'>
                      <p className='text-muted-foreground text-sm'>
                        Adicione uma camada extra de segurança à sua conta
                      </p>
                      <Button variant='outline' size='sm'>
                        Ativar
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div className='space-y-2'>
                    <Label>Alterar Senha</Label>
                    <div className='flex items-center justify-between'>
                      <p className='text-muted-foreground text-sm'>
                        Atualize sua senha regularmente
                      </p>
                      <Button variant='outline' size='sm'>
                        Alterar
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div className='space-y-2'>
                    <Label>Sessões Ativas</Label>
                    <div className='flex items-center justify-between'>
                      <p className='text-muted-foreground text-sm'>
                        3 dispositivos ativos
                      </p>
                      <Button variant='outline' size='sm'>
                        Gerenciar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Configurações de Acesso</CardTitle>
                  <CardDescription>
                    Controle quem acessa sua conta
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='space-y-2'>
                    <Label>Usuários Convidados</Label>
                    <div className='flex items-center justify-between'>
                      <p className='text-muted-foreground text-sm'>
                        2 usuários com acesso limitado
                      </p>
                      <Button variant='outline' size='sm'>
                        Gerenciar
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div className='space-y-2'>
                    <Label>Permissões de API</Label>
                    <div className='flex items-center justify-between'>
                      <p className='text-muted-foreground text-sm'>
                        Controle de integrações de terceiros
                      </p>
                      <Button variant='outline' size='sm'>
                        Configurar
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div className='space-y-2'>
                    <Label>Histórico de Login</Label>
                    <div className='flex items-center justify-between'>
                      <p className='text-muted-foreground text-sm'>
                        Últimos acessos à sua conta
                      </p>
                      <Button variant='outline' size='sm'>
                        Ver histórico
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ABA PREFERÊNCIAS */}
          <TabsContent value='preferences'>
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Conta</CardTitle>
                <CardDescription>Personalize sua experiência</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <Label>Idioma e Região</Label>
                  <div className='flex items-center justify-between'>
                    <p className='text-muted-foreground text-sm'>
                      Português (Brasil) - GMT-3
                    </p>
                    <Button variant='outline' size='sm'>
                      Alterar
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className='space-y-2'>
                  <Label>Notificações</Label>
                  <div className='flex items-center justify-between'>
                    <p className='text-muted-foreground text-sm'>
                      Configurar preferências de notificação
                    </p>
                    <Button variant='outline' size='sm'>
                      Gerenciar
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className='space-y-2'>
                  <Label>Privacidade</Label>
                  <div className='flex items-center justify-between'>
                    <p className='text-muted-foreground text-sm'>
                      Configurações de compartilhamento de dados
                    </p>
                    <Button variant='outline' size='sm'>
                      Configurar
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className='space-y-2'>
                  <Label>Plano de Conta</Label>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='font-medium'>Plano Empresarial</p>
                      <p className='text-muted-foreground text-sm'>
                        Próxima cobrança: 10/08/2023
                      </p>
                    </div>
                    <Button variant='outline' size='sm'>
                      Gerenciar plano
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
