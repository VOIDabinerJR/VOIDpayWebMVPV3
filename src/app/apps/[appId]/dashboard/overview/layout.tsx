'use client';
import PageContainer from '@/components/layout/page-container';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardFooter
} from '@/components/ui/card';
import {
  IconTrendingDown,
  IconTrendingUp,
  IconBell,
  IconInfoCircle
} from '@tabler/icons-react';
import React from 'react';

// Interface para os dados da API
interface EstatisticasData {
  ganhosMensais: {
    valor: string;
    porcentagem: string;
    descricao: string;
    comparacao: string;
  };
  ganhosAnuais: {
    valor: string;
    porcentagem: string;
    descricao: string;
    comparacao: string;
  };
  pagamentosPendentes: {
    valor: string;
    porcentagem: string;
    descricao: string;
    comparacao: string;
    pedidos: string;
  };
  checkoutsRealizados: {
    valor: number;
    porcentagem: string;
    descricao: string;
    comparacao: string;
  };
  visaoGeralGanhos: {
    titulo: string;
    periodo: string;
    totalGeral: string;
    datas: string[];
  };
  balancoPedidos: {
    titulo: string;
    descricao: string;
    totalPedidos: number;
    distribuicao: {
      status: string;
      porcentagem: number;
    }[];
  };
}

async function getEstatisticas(): Promise<EstatisticasData> {
  try {
    const response = await fetch('http://localhost:3000/api/statics', {
      next: { revalidate: 3600 } // Revalida a cada hora
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar estatísticas');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    // Retorna dados padrão em caso de erro
    return {
      ganhosMensais: {
        valor: '5.250 MTn',
        porcentagem: '+8.5%',
        descricao: 'Crescimento este mês',
        comparacao: 'Comparado ao mês anterior'
      },
      ganhosAnuais: {
        valor: '2.500 MTn',
        porcentagem: '+15%',
        descricao: 'Crescimento anual',
        comparacao: 'Comparado ao ano anterior'
      },
      pagamentosPendentes: {
        valor: '350 MTn',
        porcentagem: '-5%',
        descricao: 'Redução em relação ao mês passado',
        comparacao: '12 pedidos aguardando pagamento',
        pedidos: '12'
      },
      checkoutsRealizados: {
        valor: 128,
        porcentagem: '+22%',
        descricao: 'Aumento nas conversões',
        comparacao: 'Taxa de conversão melhorada'
      },
      visaoGeralGanhos: {
        titulo: 'Seus Ganhos',
        periodo: 'Total dos últimos 3 meses',
        totalGeral: 'MZN 2.582,00',
        datas: ['1/04', '2/04', '3/04', '30/06']
      },
      balancoPedidos: {
        titulo: 'Balanço de Pedidos',
        descricao: 'Distribuição de pedidos por status no último mês',
        totalPedidos: 1072,
        distribuicao: [
          { status: 'Finalizados', porcentagem: 50.6 },
          { status: 'Pendentes', porcentagem: 20.3 },
          { status: 'Cancelados', porcentagem: 15.2 },
          { status: 'Processando', porcentagem: 13.9 }
        ]
      }
    };
  }
}

export default async function OverViewLayout({
  sales,
  pie_stats,
  bar_stats,
  area_stats,
  last_payments
}: {
  sales: React.ReactNode;
  pie_stats: React.ReactNode;
  bar_stats: React.ReactNode;
  area_stats: React.ReactNode;
  last_payments: React.ReactNode;
}) {
  // Busca os dados da API
  const estatisticas = await getEstatisticas();

  // Simulando dados do usuário (substitua pelos dados reais)
  const userName = 'Abiner Maleiane';
  const notifications = [
    { id: 1, text: 'Novo pedido recebido', time: '10 min atrás' },
    { id: 2, text: 'Pagamento confirmado', time: '1 hora atrás' }
  ];

  // Função para determinar o ícone baseado no sinal da porcentagem
  const getTrendIcon = (porcentagem: string) => {
    return porcentagem.includes('+') ? (
      <IconTrendingUp className='size-4' />
    ) : (
      <IconTrendingDown className='size-4' />
    );
  };

  // Função para determinar a variante do badge baseado no sinal
  const getBadgeVariant = (porcentagem: string) => {
    return porcentagem.includes('+') ? 'default' : 'destructive';
  };

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-4'>
        {/* Cabeçalho com saudação e notificações */}
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              Olá, {userName} 👋
            </h2>
            {/* CAMPO TEMPORARIO */}
            {/* <p style={{ color: 'red' }}>User: {user ? ' ' + JSON.stringify(user, null, 2) : ''}</p> */}
            <p className='text-muted-foreground'>
              Aqui está o resumo do seu negócio
            </p>
          </div>
        </div>

        {/* Estatísticas principais */}
        <div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4'>
          {/* Ganhos Mensais */}
          <Card className='@container/card'>
            <CardHeader>
              <CardDescription>Ultimos 30 dias</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                {estatisticas.ganhosMensais.valor}
              </CardTitle>
              <CardAction>
                <Badge
                  variant={getBadgeVariant(
                    estatisticas.ganhosMensais.porcentagem
                  )}
                >
                  {getTrendIcon(estatisticas.ganhosMensais.porcentagem)}
                  {estatisticas.ganhosMensais.porcentagem}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='line-clamp-1 flex gap-2 font-medium'>
                {estatisticas.ganhosMensais.descricao}{' '}
                {getTrendIcon(estatisticas.ganhosMensais.porcentagem)}
              </div>
              <div className='text-muted-foreground'>
                {estatisticas.ganhosMensais.comparacao}
              </div>
            </CardFooter>
          </Card>

          {/* Ganhos Anuais */}
          <Card className='@container/card'>
            <CardHeader>
              <CardDescription>Ganhos Anuais</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                {estatisticas.ganhosAnuais.valor}
              </CardTitle>
              <CardAction>
                <Badge
                  variant={getBadgeVariant(
                    estatisticas.ganhosAnuais.porcentagem
                  )}
                >
                  {getTrendIcon(estatisticas.ganhosAnuais.porcentagem)}
                  {estatisticas.ganhosAnuais.porcentagem}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='line-clamp-1 flex gap-2 font-medium'>
                {estatisticas.ganhosAnuais.descricao}{' '}
                {getTrendIcon(estatisticas.ganhosAnuais.porcentagem)}
              </div>
              <div className='text-muted-foreground'>
                {estatisticas.ganhosAnuais.comparacao}
              </div>
            </CardFooter>
          </Card>

          {/* Pagamentos Pendentes */}
          <Card className='@container/card'>
            <CardHeader>
              <CardDescription>Pagamentos Pendentes</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                {estatisticas.pagamentosPendentes.valor}
              </CardTitle>
              <CardAction>
                <Badge
                  variant={getBadgeVariant(
                    estatisticas.pagamentosPendentes.porcentagem
                  )}
                >
                  {getTrendIcon(estatisticas.pagamentosPendentes.porcentagem)}
                  {estatisticas.pagamentosPendentes.porcentagem}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='line-clamp-1 flex gap-2 font-medium'>
                {estatisticas.pagamentosPendentes.descricao}{' '}
                {getTrendIcon(estatisticas.pagamentosPendentes.porcentagem)}
              </div>
              <div className='text-muted-foreground'>
                {estatisticas.pagamentosPendentes.comparacao}
              </div>
            </CardFooter>
          </Card>

          {/* Checkouts Realizados */}
          <Card className='@container/card'>
            <CardHeader>
              <CardDescription>Checkouts Realizados</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                {estatisticas.checkoutsRealizados.valor}
              </CardTitle>
              <CardAction>
                <Badge
                  variant={getBadgeVariant(
                    estatisticas.checkoutsRealizados.porcentagem
                  )}
                >
                  {getTrendIcon(estatisticas.checkoutsRealizados.porcentagem)}
                  {estatisticas.checkoutsRealizados.porcentagem}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='line-clamp-1 flex gap-2 font-medium'>
                {estatisticas.checkoutsRealizados.descricao}{' '}
                {getTrendIcon(estatisticas.checkoutsRealizados.porcentagem)}
              </div>
              <div className='text-muted-foreground'>
                {estatisticas.checkoutsRealizados.comparacao}
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Gráficos e tabelas */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7'>
          <div className='col-span-4'>
            <Card>
              <CardHeader>
                <CardTitle>{estatisticas.visaoGeralGanhos.titulo}</CardTitle>
                <CardDescription>
                  {estatisticas.visaoGeralGanhos.periodo}
                </CardDescription>
              </CardHeader>
              {bar_stats}
            </Card>
          </div>

          <div className='col-span-4 md:col-span-3'>
            <Card>
              <CardHeader>
                <CardTitle>{estatisticas.balancoPedidos.titulo}</CardTitle>
                <CardDescription>
                  {estatisticas.balancoPedidos.descricao}
                </CardDescription>
              </CardHeader>
              {pie_stats}
            </Card>
          </div>

          <div className='col-span-4'>
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Vendas</CardTitle>
              </CardHeader>
              {area_stats}
            </Card>
          </div>

          <div className='col-span-4 md:col-span-3'>
            <Card>
              <CardHeader>
                <CardTitle>Tabela de Pedidos Recentes</CardTitle>
              </CardHeader>
              {sales}
            </Card>
          </div>
        </div>

        {last_payments}

        {/* Área de informações úteis */}
        <Card className='mt-4'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <IconInfoCircle className='size-5' /> Informações Úteis
            </CardTitle>
          </CardHeader>
          <div className='grid grid-cols-1 gap-4 px-6 pb-4 md:grid-cols-2 lg:grid-cols-3'>
            <div className='rounded-lg border p-4'>
              <h3 className='mb-2 font-medium'>Dicas de Vendas</h3>
              <p className='text-muted-foreground text-sm'>
                Seus produtos mais vendidos estão com estoque baixo. Considere
                repor.
              </p>
            </div>
            <div className='rounded-lg border p-4'>
              <h3 className='mb-2 font-medium'>Suporte Rápido</h3>
              <p className='text-muted-foreground text-sm'>
                Problemas com pagamentos? Contate nosso suporte imediatamente.
              </p>
            </div>
            <div className='rounded-lg border p-4'>
              <h3 className='mb-2 font-medium'>Novidades</h3>
              <p className='text-muted-foreground text-sm'>
                Nova atualização disponível! Melhorias no painel de controle.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
