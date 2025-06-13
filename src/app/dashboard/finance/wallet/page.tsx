'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
  DropdownMenuTrigger,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { 
  IconSearch, 
  IconFilter, 
  IconDownload, 
  IconRefresh,
  IconChevronDown,
  IconCircleCheck,
  IconCircleX,
  IconClock,
  IconPlus,
  IconWallet,
  IconRepeat,
  IconSettingsAutomation
} from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';

export default function WithdrawalManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [withdrawalType, setWithdrawalType] = useState('manual');
  const [activeTab, setActiveTab] = useState('pending');
  const [autoWithdrawalEnabled, setAutoWithdrawalEnabled] = useState(false);
  const [autoWithdrawalThreshold, setAutoWithdrawalThreshold] = useState(5000);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('');

  // Dados de exemplo para saques
  const withdrawals = [
    {
      id: 'SAQ-2023-001',
      reference: 'Pagamento fornecedor',
      amount: 15000.00,
      currency: 'MZN',
      date: '2023-11-15',
      destination: 'Banco BIM •••• 7890',
      status: 'completed',
      type: 'manual',
      fee: 150.00,
      netAmount: 14850.00
    },
    {
      id: 'SAQ-2023-002',
      reference: 'Salários equipe',
      amount: 85000.00,
      currency: 'MZN',
      date: '2023-11-16',
      destination: 'Banco Millennium •••• 1234',
      status: 'pending',
      type: 'manual',
      fee: 850.00,
      netAmount: 84150.00
    },
    {
      id: 'SAQ-2023-003',
      reference: 'Saque automático',
      amount: 5200.00,
      currency: 'MZN',
      date: '2023-11-17',
      destination: 'Conta VOIDpay •••• 5678',
      status: 'processing',
      type: 'auto',
      fee: 52.00,
      netAmount: 5148.00
    },
    {
      id: 'SAQ-2023-004',
      reference: 'Investimentos',
      amount: 25000.00,
      currency: 'MZN',
      date: '2023-11-18',
      destination: 'Banco ABC •••• 3456',
      status: 'failed',
      type: 'manual',
      fee: 250.00,
      netAmount: 24750.00
    },
    {
      id: 'SAQ-2023-005',
      reference: 'Saque automático',
      amount: 7500.00,
      currency: 'MZN',
      date: '2023-11-19',
      destination: 'Conta VOIDpay •••• 5678',
      status: 'completed',
      type: 'auto',
      fee: 75.00,
      netAmount: 7425.00
    }
  ];

  // Contas disponíveis
  const accounts = [
    { id: '1', name: 'Banco BIM •••• 7890', type: 'bank' },
    { id: '2', name: 'Banco Millennium •••• 1234', type: 'bank' },
    { id: '3', name: 'Conta VOIDpay •••• 5678', type: 'ewallet' },
    { id: '4', name: 'Banco ABC •••• 3456', type: 'bank' }
  ];

  // Filtrar saques
  const filteredWithdrawals = withdrawals.filter(withdrawal => {
    const matchesSearch = 
      withdrawal.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      withdrawal.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      withdrawal.destination.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || withdrawal.status === statusFilter;
    
    const matchesTab = 
      (activeTab === 'pending' && (withdrawal.status === 'pending' || withdrawal.status === 'processing')) ||
      (activeTab === 'completed' && withdrawal.status === 'completed') ||
      (activeTab === 'failed' && withdrawal.status === 'failed') ||
      activeTab === 'all';
    
    return matchesSearch && matchesStatus && matchesTab;
  });

  const handleNewWithdrawal = () => {
    // Lógica para criar novo saque
    console.log(`Criando saque de ${withdrawalAmount} para ${selectedAccount}`);
  };

  const handleProcessWithdrawal = (withdrawalId: string) => {
    // Lógica para processar saque
    console.log(`Processando saque: ${withdrawalId}`);
  };

  const handleCancelWithdrawal = (withdrawalId: string) => {
    // Lógica para cancelar saque
    console.log(`Cancelando saque: ${withdrawalId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gestão de Saques</h1>
          <p className="text-muted-foreground">
            Gerencie saques manuais e automáticos dos seus fundos
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

      {/* Cartões de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Saldo Disponível
            </CardTitle>
            <IconWallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">MZN 124,850.00</div>
            <p className="text-muted-foreground text-xs">
              +18,500.00 esta semana
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Saques Pendentes
            </CardTitle>
            <IconClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">MZN 85,000.00</div>
            <p className="text-muted-foreground text-xs">
              2 saques por processar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Taxas de Saque
            </CardTitle>
            <span className="text-muted-foreground text-xs">30 dias</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">MZN 1,377.00</div>
            <p className="text-muted-foreground text-xs">
              1% do valor sacado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Próximo Saque Auto
            </CardTitle>
            <IconSettingsAutomation className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {autoWithdrawalEnabled ? 'Ativo' : 'Inativo'}
            </div>
            <Progress 
              value={45} 
              className={`h-2 mt-2 ${autoWithdrawalEnabled ? 'bg-primary' : 'bg-muted'}`}
            />
            <p className="text-muted-foreground text-xs mt-1">
              {autoWithdrawalEnabled ? 
                `Acionará em MZN ${autoWithdrawalThreshold - 124850}` : 
                'Não configurado'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Abas e Filtros */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          <Button
            variant={activeTab === 'all' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('all')}
          >
            Todos
          </Button>
          <Button
            variant={activeTab === 'pending' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('pending')}
          >
            Pendentes
          </Button>
          <Button
            variant={activeTab === 'completed' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('completed')}
          >
            Concluídos
          </Button>
          <Button
            variant={activeTab === 'failed' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('failed')}
          >
            Falhados
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="relative">
            <IconSearch className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="ID, Referência ou Conta..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Todos Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos Status</SelectItem>
              <SelectItem value="completed">Concluídos</SelectItem>
              <SelectItem value="pending">Pendentes</SelectItem>
              <SelectItem value="processing">Processando</SelectItem>
              <SelectItem value="failed">Falhados</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={setWithdrawalType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Todos Tipos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos Tipos</SelectItem>
              <SelectItem value="manual">Manuais</SelectItem>
              <SelectItem value="auto">Automáticos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Novo Saque e Configurações Automáticas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário de Novo Saque */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Novo Saque</CardTitle>
            <CardDescription>
              Realize um saque manual para sua conta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Valor (MZN)</Label>
              <Input 
                id="amount" 
                placeholder="0.00" 
                value={withdrawalAmount}
                onChange={(e) => setWithdrawalAmount(e.target.value)}
              />
              <p className="text-muted-foreground text-xs">
                Saldo disponível: MZN 124,850.00
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="account">Conta Destino</Label>
              <Select onValueChange={setSelectedAccount}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma conta" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map(account => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reference">Referência (Opcional)</Label>
              <Input id="reference" placeholder="Ex: Pagamento fornecedor" />
            </div>

            <div className="pt-2">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Taxa:</span>
                <span>MZN {(Number(withdrawalAmount || 0) * 0.01)}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Valor líquido:</span>
                <span className="font-medium">
                  MZN {(Number(withdrawalAmount || 0) * 0.99)}
                </span>
              </div>
            </div>

            <Button 
              className="w-full mt-4" 
              disabled={!withdrawalAmount || !selectedAccount}
              onClick={handleNewWithdrawal}
            >
              <IconPlus className="mr-2 h-4 w-4" />
              Solicitar Saque
            </Button>
          </CardContent>
        </Card>

        {/* Configurações de Saque Automático */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Saque Automático</CardTitle>
            <CardDescription>
              Configure transferências automáticas periódicas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="auto-withdrawal">Ativar Saque Automático</Label>
              <Switch 
                id="auto-withdrawal" 
                checked={autoWithdrawalEnabled}
                onCheckedChange={setAutoWithdrawalEnabled}
              />
            </div>

            {autoWithdrawalEnabled && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="threshold">Limite para Acionar (MZN)</Label>
                  <Input 
                    id="threshold" 
                    type="number" 
                    value={autoWithdrawalThreshold}
                    onChange={(e) => setAutoWithdrawalThreshold(Number(e.target.value))}
                  />
                  <p className="text-muted-foreground text-xs">
                    Quando seu saldo atingir este valor, o saque será automático
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="auto-account">Conta Destino</Label>
                  <Select defaultValue="3">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma conta" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map(account => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 pt-2">
                  <Label>Frequência</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline">Diário</Button>
                    <Button variant="outline">Semanal</Button>
                    <Button>Mensal</Button>
                  </div>
                </div>

                <Button className="w-full mt-4">
                  <IconSettingsAutomation className="mr-2 h-4 w-4" />
                  Salvar Configurações
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Tabela de Saques */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Saques</CardTitle>
              <CardDescription>
                Últimos saques realizados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Conta</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWithdrawals.slice(0, 4).map((withdrawal) => (
                    <TableRow key={withdrawal.id}>
                      <TableCell className="font-medium">{withdrawal.id}</TableCell>
                      <TableCell>MZN {withdrawal.amount.toFixed(2)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {withdrawal.destination}
                      </TableCell>
                      <TableCell>
                        {withdrawal.status === 'completed' && (
                          <Badge variant="default">Concluído</Badge>
                        )}
                        {withdrawal.status === 'pending' && (
                          <Badge variant="secondary">Pendente</Badge>
                        )}
                        {withdrawal.status === 'processing' && (
                          <Badge variant="secondary">Processando</Badge>
                        )}
                        {withdrawal.status === 'failed' && (
                          <Badge variant="destructive">Falhou</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Cartão de Limites */}
          <Card>
            <CardHeader>
              <CardTitle>Limites de Saque</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Mínimo por saque:</span>
                <span>MZN 500.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Máximo por saque:</span>
                <span>MZN 100,000.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Limite diário:</span>
                <span>MZN 200,000.00</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between text-sm font-medium">
                <span>Saques hoje:</span>
                <span>MZN 85,000.00 / 200,000.00</span>
              </div>
              <Progress value={42.5} className="h-2" />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabela Completa de Saques */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Todos os Saques</CardTitle>
              <CardDescription>
                Lista completa de operações de saque
              </CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <IconFilter className="mr-2 h-4 w-4" />
                  Filtrar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
                <DropdownMenuItem>Mais Recente</DropdownMenuItem>
                <DropdownMenuItem>Maior Valor</DropdownMenuItem>
                <DropdownMenuItem>Menor Valor</DropdownMenuItem>
                <DropdownMenuItem>Status</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Saque</TableHead>
                <TableHead>Referência</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Taxa</TableHead>
                <TableHead>Líquido</TableHead>
                <TableHead>Conta Destino</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWithdrawals.map((withdrawal) => (
                <TableRow key={withdrawal.id}>
                  <TableCell className="font-medium">{withdrawal.id}</TableCell>
                  <TableCell>{withdrawal.reference}</TableCell>
                  <TableCell>MZN {withdrawal.amount.toFixed(2)}</TableCell>
                  <TableCell>MZN {withdrawal.fee.toFixed(2)}</TableCell>
                  <TableCell>MZN {withdrawal.netAmount.toFixed(2)}</TableCell>
                  <TableCell>{withdrawal.destination}</TableCell>
                  <TableCell>{withdrawal.date}</TableCell>
                  <TableCell>
                    {withdrawal.type === 'auto' ? (
                      <Badge variant="outline" className="border-primary">
                        <IconRepeat className="h-3 w-3 mr-1" />
                        Automático
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        Manual
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {withdrawal.status === 'completed' && (
                      <Badge variant="default">
                        <IconCircleCheck className="h-3 w-3 mr-1" />
                        Concluído
                      </Badge>
                    )}
                    {withdrawal.status === 'pending' && (
                      <Badge variant="secondary">
                        <IconClock className="h-3 w-3 mr-1" />
                        Pendente
                      </Badge>
                    )}
                    {withdrawal.status === 'processing' && (
                      <Badge variant="secondary">
                        <IconClock className="h-3 w-3 mr-1" />
                        Processando
                      </Badge>
                    )}
                    {withdrawal.status === 'failed' && (
                      <Badge variant="destructive">
                        <IconCircleX className="h-3 w-3 mr-1" />
                        Falhou
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {withdrawal.status === 'pending' && (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleProcessWithdrawal(withdrawal.id)}
                          >
                            Processar
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleCancelWithdrawal(withdrawal.id)}
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
    </div>
  );
}