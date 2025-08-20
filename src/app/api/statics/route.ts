import { NextResponse } from 'next/server';

// Interface para tipar os dados
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

export async function GET() {
  try {
    // Dados mockados baseados nos valores fornecidos
    const dados: EstatisticasData = {
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

    return NextResponse.json(dados);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao carregar estatísticas' },
      { status: 500 }
    );
  }
}
