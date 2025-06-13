'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  IconSearch, 
  IconFilter, 
  IconDownload, 
  IconRefresh,
  IconChevronDown,
  IconCircleCheck,
  IconCircleX,
  IconClock
} from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';

export default function RefundManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Dados de exemplo para reembolsos
  const refunds = [
    {
      id: 'REF-2023-001',
      transactionId: 'TXN-789456',
      amount: 2880.00,
      currency: 'MZN',
      date: '2023-11-15',
      customer: 'João Matavel',
      reason: 'Produto não entregue',
      status: 'completed',
      method: 'Cartão de Crédito'
    },
    {
      id: 'REF-2023-002',
      transactionId: 'TXN-789457',
      amount: 1500.00,
      currency: 'MZN',
      date: '2023-11-16',
      customer: 'Maria Fernanda',
      reason: 'Arrependimento de compra',
      status: 'pending',
      method: 'Paysal'
    },
    {
      id: 'REF-2023-003',
      transactionId: 'TXN-789458',
      amount: 750.50,
      currency: 'MZN',
      date: '2023-11-17',
      customer: 'Carlos Dias',
      reason: 'Produto com defeito',
      status: 'failed',
      method: 'Transferência Bancária'
    },
    {
      id: 'REF-2023-004',
      transactionId: 'TXN-789459',
      amount: 3200.00,
      currency: 'MZN',
      date: '2023-11-18',
      customer: 'Ana Silva',
      reason: 'Cancelamento de serviço',
      status: 'completed',
      method: 'Cartão de Débito'
    },
    {
      id: 'REF-2023-005',
      transactionId: 'TXN-789460',
      amount: 1200.00,
      currency: 'MZN',
      date: '2023-11-19',
      customer: 'Paulo Mutemba',
      reason: 'Duplicidade de cobrança',
      status: 'pending',
      method: 'QR Code'
    }
  ];

  // Filtrar reembolsos com base na pesquisa e filtro
  const filteredRefunds = refunds.filter(refund => {
    const matchesSearch = 
      refund.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      refund.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      refund.customer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || refund.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleProcessRefund = (refundId: string) => {
    // Lógica para processar reembolso
    console.log(`Processando reembolso: ${refundId}`);
  };

  const handleCancelRefund = (refundId: string) => {
    // Lógica para cancelar reembolso
    console.log(`Cancelando reembolso: ${refundId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gestão de Reembolsos</h1>
          <p className="text-muted-foreground">
            Visualize e gerencie todos os pedidos de reembolso
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <IconDownload className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button>
            <IconRefresh className="mr-2 h-4 w-4" />
            Atualizar
          </Button>
        </div>
      </div>

      <Separator />

      {/* Filtros e Busca */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Pesquisar</Label>
              <div className="relative">
                <IconSearch className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="ID, Transação ou Cliente..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {statusFilter === 'all' ? 'Todos Status' : 
                     statusFilter === 'completed' ? 'Completos' :
                     statusFilter === 'pending' ? 'Pendentes' : 'Falhados'}
                    <IconChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                    Todos
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('completed')}>
                    Completos
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('pending')}>
                    Pendentes
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('failed')}>
                    Falhados
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-2">
              <Label>Período</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    Últimos 30 dias
                    <IconChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Hoje</DropdownMenuItem>
                  <DropdownMenuItem>Últimos 7 dias</DropdownMenuItem>
                  <DropdownMenuItem>Últimos 30 dias</DropdownMenuItem>
                  <DropdownMenuItem>Personalizado</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Reembolsos
            </CardTitle>
            <span className="text-muted-foreground text-xs">30 dias</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-muted-foreground text-xs">
              +12% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Valor Total
            </CardTitle>
            <span className="text-muted-foreground text-xs">30 dias</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">MZN 42,560.00</div>
            <p className="text-muted-foreground text-xs">
              +8% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pendentes
            </CardTitle>
            <span className="text-muted-foreground text-xs">Por resolver</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-muted-foreground text-xs">
              2 com mais de 7 dias
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Taxa de Sucesso
            </CardTitle>
            <span className="text-muted-foreground text-xs">30 dias</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-muted-foreground text-xs">
              3% melhor que o mês anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Reembolsos */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Reembolsos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Reembolso</TableHead>
                <TableHead>ID Transação</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Método</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRefunds.map((refund) => (
                <TableRow key={refund.id}>
                  <TableCell className="font-medium">{refund.id}</TableCell>
                  <TableCell>{refund.transactionId}</TableCell>
                  <TableCell>{refund.customer}</TableCell>
                  <TableCell>{refund.amount.toFixed(2)} {refund.currency}</TableCell>
                  <TableCell>{refund.method}</TableCell>
                  <TableCell>{refund.date}</TableCell>
                  <TableCell>
                    {refund.status === 'completed' && (
                      <Badge variant="default">
                        <IconCircleCheck className="h-3 w-3 mr-1" />
                        Concluído
                      </Badge>
                    )}
                    {refund.status === 'pending' && (
                      <Badge variant="secondary">
                        <IconClock className="h-3 w-3 mr-1" />
                        Pendente
                      </Badge>
                    )}
                    {refund.status === 'failed' && (
                      <Badge variant="destructive">
                        <IconCircleX className="h-3 w-3 mr-1" />
                        Falhou
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {refund.status === 'pending' && (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleProcessRefund(refund.id)}
                          >
                            Processar
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleCancelRefund(refund.id)}
                          >
                            Cancelar
                          </Button>
                        </>
                      )}
                      <Button size="sm" variant="ghost">
                        Detalhes
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal de Processamento de Reembolso (exemplo) */}
      {/* Implementar um modal real para processamento detalhado */}
    </div>
  );
}