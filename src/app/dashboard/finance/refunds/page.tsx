'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, 
  ClipboardList, 
  MessageSquare, 
  Download, 
  Search, 
  Filter,
  Calendar,
  TrendingUp,
  PieChart,
  RefreshCw,
  Eye,
  MoreHorizontal
} from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';

// Registrar componentes do ChartJS
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  PointElement, 
  LineElement
);

// Mock data baseado na estrutura do HTML original
const dashboardData = {
  wallet: {
    balance: 5287.90,
    checkoutFee: 12,
    pendingPayments: 18
  },
  stats: {
    monthlyEarnings: 5287.90,
    annualEarnings: 63454.80,
    completedOrders: 65,
    cancelledOrders: 12,
    unprocessedOrders: 8
  },
  orders: [
    {
      id: 'ORD001',
      products: 'Smartphone XYZ',
      description: 'Reembolso por produto defeituoso',
      customerName: 'João Silva',
      customerEmail: 'joao@email.com',
      paymentMethod: 'M-Pesa',
      orderStatus: 'Processando',
      totalAmount: 150.00,
      currency: 'USD',
      exchangeRate: 1.0,
      buttonToken: 'BTN123456',
      userId: 'USR001',
      walletId: 'WAL001',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-16'
    },
    {
      id: 'ORD002',
      products: 'Laptop ABC',
      description: 'Cliente não satisfeito',
      customerName: 'Maria Santos',
      customerEmail: 'maria@email.com',
      paymentMethod: 'E-Mola',
      orderStatus: 'Aprovado',
      totalAmount: 850.00,
      currency: 'USD',
      exchangeRate: 1.0,
      buttonToken: 'BTN123457',
      userId: 'USR002',
      walletId: 'WAL002',
      createdAt: '2024-01-12',
      updatedAt: '2024-01-14'
    },
    {
      id: 'ORD003',
      products: 'Headphones DEF',
      description: 'Produto não entregue',
      customerName: 'Carlos Mozambique',
      customerEmail: 'carlos@email.com',
      paymentMethod: 'BCI',
      orderStatus: 'Rejeitado',
      totalAmount: 75.50,
      currency: 'USD',
      exchangeRate: 1.0,
      buttonToken: 'BTN123458',
      userId: 'USR003',
      walletId: 'WAL003',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-11'
    },
    {
      id: 'ORD004',
      products: 'Tablet GHI',
      description: 'Erro na cobrança',
      customerName: 'Ana Costa',
      customerEmail: 'ana@email.com',
      paymentMethod: 'MillenimBim',
      orderStatus: 'Pendente',
      totalAmount: 320.00,
      currency: 'USD',
      exchangeRate: 1.0,
      buttonToken: 'BTN123459',
      userId: 'USR004',
      walletId: 'WAL004',
      createdAt: '2024-01-08',
      updatedAt: '2024-01-09'
    },
    {
      id: 'ORD005',
      products: 'Monitor 4K',
      description: 'Tela com defeito de fábrica',
      customerName: 'Pedro Almeida',
      customerEmail: 'pedro@email.com',
      paymentMethod: 'BIM',
      orderStatus: 'Processando',
      totalAmount: 450.00,
      currency: 'USD',
      exchangeRate: 1.0,
      buttonToken: 'BTN123460',
      userId: 'USR005',
      walletId: 'WAL005',
      createdAt: '2024-01-07',
      updatedAt: '2024-01-08'
    },
    {
      id: 'ORD006',
      products: 'Mouse Gamer',
      description: 'Produto não funciona',
      customerName: 'Luisa Ferreira',
      customerEmail: 'luisa@email.com',
      paymentMethod: 'M-Pesa',
      orderStatus: 'Aprovado',
      totalAmount: 25.99,
      currency: 'USD',
      exchangeRate: 1.0,
      buttonToken: 'BTN123461',
      userId: 'USR006',
      walletId: 'WAL006',
      createdAt: '2024-01-06',
      updatedAt: '2024-01-07'
    },
    {
      id: 'ORD007',
      products: 'Teclado Mecânico',
      description: 'Teclas não respondem',
      customerName: 'Ricardo Santos',
      customerEmail: 'ricardo@email.com',
      paymentMethod: 'E-Mola',
      orderStatus: 'Pendente',
      totalAmount: 89.50,
      currency: 'USD',
      exchangeRate: 1.0,
      buttonToken: 'BTN123462',
      userId: 'USR007',
      walletId: 'WAL007',
      createdAt: '2024-01-05',
      updatedAt: '2024-01-06'
    },
    {
      id: 'ORD008',
      products: 'Webcam HD',
      description: 'Imagem com defeito',
      customerName: 'Fernanda Lima',
      customerEmail: 'fernanda@email.com',
      paymentMethod: 'BCI',
      orderStatus: 'Rejeitado',
      totalAmount: 65.00,
      currency: 'USD',
      exchangeRate: 1.0,
      buttonToken: 'BTN123463',
      userId: 'USR008',
      walletId: 'WAL008',
      createdAt: '2024-01-04',
      updatedAt: '2024-01-05'
    },
    {
      id: 'ORD009',
      products: 'SSD 1TB',
      description: 'Velocidade abaixo do esperado',
      customerName: 'Gabriel Costa',
      customerEmail: 'gabriel@email.com',
      paymentMethod: 'MillenimBim',
      orderStatus: 'Processando',
      totalAmount: 180.00,
      currency: 'USD',
      exchangeRate: 1.0,
      buttonToken: 'BTN123464',
      userId: 'USR009',
      walletId: 'WAL009',
      createdAt: '2024-01-03',
      updatedAt: '2024-01-04'
    },
    {
      id: 'ORD010',
      products: 'Impressora Laser',
      description: 'Não imprime cores',
      customerName: 'Patrícia Oliveira',
      customerEmail: 'patricia@email.com',
      paymentMethod: 'BIM',
      orderStatus: 'Aprovado',
      totalAmount: 299.99,
      currency: 'USD',
      exchangeRate: 1.0,
      buttonToken: 'BTN123465',
      userId: 'USR010',
      walletId: 'WAL010',
      createdAt: '2024-01-02',
      updatedAt: '2024-01-03'
    }
  ],
  conversions: [
    { name: 'Server Migration', percentage: 20, color: 'bg-red-500' },
    { name: 'Sales Tracking', percentage: 40, color: 'bg-yellow-500' },
    { name: 'Customer Database', percentage: 60, color: 'bg-blue-500' },
    { name: 'Payout Details', percentage: 80, color: 'bg-cyan-500' },
    { name: 'Account Setup', percentage: 100, color: 'bg-green-500' }
  ],
  // Novos dados para os gráficos
  earningsData: {
    labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
,
    data: [4000, 3000, 5000, 4500, 6000, 5500, 7000, 6500, 8000, 7500, 9000, 8500]
  },
  revenueSources: {
    labels: ['Concluído', 'Cancelado', 'Não processado'],
    data: [65, 12, 8],
    backgroundColor: ['#3B82F6', '#10B981', '#06B6D4']
  }
};

export default function RefundsPage() {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'aprovado':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'processando':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pendente':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'rejeitado':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Configuração do gráfico de barras (Earnings Overview)
  const earningsChartData = {
    labels: dashboardData.earningsData.labels,
    datasets: [
      {
        label: 'Earnings',
        data: dashboardData.earningsData.data,
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
        tension: 0.1
      }
    ]
  };

  const earningsChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  // Configuração do gráfico de pizza (Revenue Sources)
  const revenueChartData = {
    labels: dashboardData.revenueSources.labels,
    datasets: [
      {
        data: dashboardData.revenueSources.data,
        backgroundColor: dashboardData.revenueSources.backgroundColor,
        borderWidth: 0
      }
    ]
  };

  const revenueChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    },
    maintainAspectRatio: false
  };

  return (
    <div className="max-h-screen overflow-y-auto">
      <div className="flex flex-col gap-4 p-3 sm:p-4 lg:p-6 max-w-full min-w-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white-800">
           Reembolsos
          </h1>
          <Button onClick={() => window.print()} size="sm" className="w-full sm:w-auto">
            <Download className="mr-2 h-4 w-4" /> 
            <span className="hidden sm:inline">Relatório</span>
            <span className="sm:hidden">Export</span>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Monthly Earnings */}
          <Card className="border-l-4 border-blue-500 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-3 sm:p-4">
              <CardTitle className="text-xs font-bold text-blue-600 uppercase leading-tight">
                Ganhos<br className="sm:hidden" /><span className="hidden sm:inline"> </span>(Monthly)
              </CardTitle>
              <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-gray-300 flex-shrink-0" />
            </CardHeader>
            <CardContent className="p-3 sm:p-4 pt-0">
              <div className="text-lg sm:text-2xl font-bold text-white-800">
                ${dashboardData.stats.monthlyEarnings.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          {/* Annual Earnings */}
          <Card className="border-l-4 border-green-500 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-3 sm:p-4">
              <CardTitle className="text-xs font-bold text-green-600 uppercase leading-tight">
                Ganhos<br className="sm:hidden" /><span className="hidden sm:inline"> </span>(Annual)
              </CardTitle>
              <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-gray-300 flex-shrink-0" />
            </CardHeader>
            <CardContent className="p-3 sm:p-4 pt-0">
              <div className="text-lg sm:text-2xl font-bold text-white-800">
                ${dashboardData.stats.annualEarnings.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          {/* Checkout Rate */}
          <Card className="border-l-4 border-cyan-500 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-3 sm:p-4">
              <CardTitle className="text-xs font-bold text-cyan-600 uppercase leading-tight">
                Taxa<br className="sm:hidden" /><span className="hidden sm:inline"> </span>Checkout
              </CardTitle>
              <ClipboardList className="h-6 w-6 sm:h-8 sm:w-8 text-gray-300 flex-shrink-0" />
            </CardHeader>
            <CardContent className="p-3 sm:p-4 pt-0">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="text-lg sm:text-2xl font-bold text-white-800">
                  {dashboardData.wallet.checkoutFee}%
                </div>
                <div className="flex-1 min-w-0">
                  <Progress value={dashboardData.wallet.checkoutFee} className="w-full h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pending Payments */}
          <Card className="border-l-4 border-yellow-500 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-3 sm:p-4">
              <CardTitle className="text-xs font-bold text-yellow-600 uppercase leading-tight">
                Pagamentos<br className="sm:hidden" /><span className="hidden sm:inline"> </span>Pendentes
              </CardTitle>
              <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-gray-300 flex-shrink-0" />
            </CardHeader>
            <CardContent className="p-3 sm:p-4 pt-0">
              <div className="text-lg sm:text-2xl font-bold text-white-800">
                {dashboardData.wallet.pendingPayments}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Earnings Overview Chart */}
          <Card className="lg:col-span-2 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
              <CardTitle className="text-base sm:text-lg font-bold text-blue-600">
                Visão Geral Ganhos
              </CardTitle>
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <div className="h-32 sm:h-48 lg:h-56">
                <Line data={earningsChartData} options={earningsChartOptions} />
              </div>
            </CardContent>
          </Card>

          {/* Revenue Sources Pie Chart */}
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
              <CardTitle className="text-base sm:text-lg font-bold text-blue-600">
                Revenue Sources
              </CardTitle>
              <PieChart className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <div className="h-24 sm:h-32 lg:h-40 mb-3">
                <Pie data={revenueChartData} options={revenueChartOptions} />
              </div>
              <div className="flex flex-col gap-1.5 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-blue-500 rounded-full flex-shrink-0"></div>
                  <span>Finalizados ({dashboardData.stats.completedOrders})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full flex-shrink-0"></div>
                  <span>Cancelados ({dashboardData.stats.cancelledOrders})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-cyan-500 rounded-full flex-shrink-0"></div>
                  <span>Não processados ({dashboardData.stats.unprocessedOrders})</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Refunds Table */}
        <Card className="shadow-sm">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base sm:text-lg font-bold text-blue-600">
              Reembolsos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar reembolsos..."
                  className="pl-10 h-10"
                />
              </div>
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                <Filter className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Filtrar</span>
                <span className="sm:hidden">Filter</span>
              </Button>
            </div>
            
            {/* Table Container com scroll horizontal e vertical */}
            <div className="border rounded-lg overflow-x-auto overflow-y-auto max-h-96">
              <Table className="w-full">
                <TableHeader className="bg-black-50 sticky top-0 z-10">
                  <TableRow>
                    <TableHead className="whitespace-nowrap font-semibold text-xs sm:text-sm p-2 sm:p-3 min-w-[80px]">
                      ID
                    </TableHead>
                    <TableHead className="whitespace-nowrap font-semibold text-xs sm:text-sm p-2 sm:p-3 min-w-[120px]">
                      Produtos
                    </TableHead>
                    <TableHead className="whitespace-nowrap font-semibold text-xs sm:text-sm p-2 sm:p-3 hidden md:table-cell min-w-[150px]">
                      Descrição
                    </TableHead>
                    <TableHead className="whitespace-nowrap font-semibold text-xs sm:text-sm p-2 sm:p-3 min-w-[100px]">
                      Cliente
                    </TableHead>
                    <TableHead className="whitespace-nowrap font-semibold text-xs sm:text-sm p-2 sm:p-3 hidden lg:table-cell min-w-[150px]">
                      Email
                    </TableHead>
                    <TableHead className="whitespace-nowrap font-semibold text-xs sm:text-sm p-2 sm:p-3 hidden sm:table-cell min-w-[100px]">
                      Método
                    </TableHead>
                    <TableHead className="whitespace-nowrap font-semibold text-xs sm:text-sm p-2 sm:p-3 min-w-[100px]">
                      Status
                    </TableHead>
                    <TableHead className="whitespace-nowrap font-semibold text-xs sm:text-sm p-2 sm:p-3 min-w-[80px]">
                      Valor
                    </TableHead>
                    <TableHead className="whitespace-nowrap font-semibold text-xs sm:text-sm p-2 sm:p-3 hidden xl:table-cell min-w-[100px]">
                      Data
                    </TableHead>
                    <TableHead className="whitespace-nowrap font-semibold text-xs sm:text-sm p-2 sm:p-3 min-w-[120px]">
                      Ações
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dashboardData.orders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-black-50 text-xs sm:text-sm">
                      <TableCell className="font-medium whitespace-nowrap p-2 sm:p-3">
                        {order.id}
                      </TableCell>
                      <TableCell className="whitespace-nowrap p-2 sm:p-3 max-w-[120px] truncate">
                        {order.products}
                      </TableCell>
                      <TableCell className="max-w-[150px] truncate p-2 sm:p-3 hidden md:table-cell" title={order.description}>
                        {order.description}
                      </TableCell>
                      <TableCell className="whitespace-nowrap p-2 sm:p-3 max-w-[100px] truncate">
                        {order.customerName}
                      </TableCell>
                      <TableCell className="whitespace-nowrap p-2 sm:p-3 hidden lg:table-cell max-w-[150px] truncate">
                        {order.customerEmail}
                      </TableCell>
                      <TableCell className="whitespace-nowrap p-2 sm:p-3 hidden sm:table-cell">
                        {order.paymentMethod}
                      </TableCell>
                      <TableCell className="whitespace-nowrap p-2 sm:p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.orderStatus)}`}>
                          {order.orderStatus}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium whitespace-nowrap p-2 sm:p-3">
                        ${order.totalAmount.toFixed(2)}
                      </TableCell>
                      <TableCell className="whitespace-nowrap p-2 sm:p-3 hidden xl:table-cell">
                        {order.createdAt}
                      </TableCell>
                      <TableCell className="whitespace-nowrap p-2 sm:p-3">
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm" className="hidden sm:flex px-2 py-1 text-xs">
                            <RefreshCw className="h-3 w-3 mr-1" />
                            Processar
                          </Button>
                          <Button variant="outline" size="sm" className="sm:hidden px-2 py-1">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          {/* Conversions Progress */}
          <Card className="shadow-sm">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-base sm:text-lg font-bold text-blue-600">
                Conversões
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2 space-y-3">
              {dashboardData.conversions.map((conversion, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm font-medium truncate pr-2">
                      {conversion.name}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-500 flex-shrink-0">
                      {conversion.percentage === 100 ? 'Complete!' : `${conversion.percentage}%`}
                    </span>
                  </div>
                  <Progress value={conversion.percentage} className="w-full h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Useful Information */}
          <Card className="shadow-sm">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-base sm:text-lg font-bold text-blue-600">
                Informações Úteis
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2 text-center">
              <div className="mb-4">
                <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-gray-100 rounded-lg mx-auto flex items-center justify-center mb-3">
                  <MessageSquare className="h-10 w-10 sm:h-12 sm:w-12 lg:h-16 lg:w-16 text-gray-400" />
                </div>
              </div>
              <p className="text-gray-600 mb-4 text-xs sm:text-sm leading-relaxed">
                Gerencie reembolsos de forma eficiente e mantenha seus clientes satisfeitos com 
                processos transparentes e rápidos.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Ver Mais Informações
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Estatísticas Detalhadas */}
        <Card className="shadow-sm">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base sm:text-lg font-bold text-blue-600">
              Estatísticas Detalhadas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {dashboardData.stats.completedOrders}
                </div>
                <div className="text-sm text-gray-600">Pedidos Completos</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {dashboardData.stats.cancelledOrders}
                </div>
                <div className="text-sm text-gray-600">Pedidos Cancelados</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {dashboardData.stats.unprocessedOrders}
                </div>
                <div className="text-sm text-gray-600">Não Processados</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  ${dashboardData.wallet.balance.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">Saldo Atual</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer da Página */}
        <div className="text-center text-gray-500 text-sm py-4">
          <p>Copyright © VOIDpay 2024</p>
        </div>
      </div>
    </div>
  );
}