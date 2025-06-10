'use client'
// src/app/dashboard/finance/wallet/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DollarSign, ClipboardList, MessageSquare, ArrowDownUp, Download, Search, Filter } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

// Mock data
const walletData = {
  balance: 5287.90,
  checkoutFee: 12,
  pendingPayments: 18,
  transactions: [
    { value: 150.00, type: "Deposit", originAccount: "Account A", destinationAccount: "Account B", transactionReference: "REF123456", appId: "APP001", date: "2023-05-15" },
    { value: 89.90, type: "Withdrawal", originAccount: "Account B", destinationAccount: "Account C", transactionReference: "REF123457", appId: "APP002", date: "2023-05-12" },
    { value: 250.00, type: "Transfer", originAccount: "Account C", destinationAccount: "Account D", transactionReference: "REF123458", appId: "APP001", date: "2023-05-10" },
    { value: 42.50, type: "Payment", originAccount: "Account D", destinationAccount: "Account E", transactionReference: "REF123459", appId: "APP003", date: "2023-05-05" },
    { value: 320.75, type: "Deposit", originAccount: "Account F", destinationAccount: "Account G", transactionReference: "REF123460", appId: "APP001", date: "2023-05-03" },
    { value: 95.30, type: "Withdrawal", originAccount: "Account G", destinationAccount: "Account H", transactionReference: "REF123461", appId: "APP004", date: "2023-05-01" },
    { value: 180.00, type: "Transfer", originAccount: "Account H", destinationAccount: "Account I", transactionReference: "REF123462", appId: "APP002", date: "2023-04-28" },
    { value: 67.25, type: "Payment", originAccount: "Account I", destinationAccount: "Account J", transactionReference: "REF123463", appId: "APP005", date: "2023-04-25" },
  ]
};

export default function WalletPage() {
  return (
    <div className="flex flex-col gap-8 p-4 md:p-6 lg:p-8 max-h-screen overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold">Carteira</h1>
        <Button onClick={() => window.print()} className="w-full md:w-auto">
          <Download className="mr-2 h-4 w-4" /> Relatório
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Balance Card */}
        <Card className="border-l-4 border-green-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Saldo</CardTitle>
            <DollarSign className="h-5 w-5 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${walletData.balance.toFixed(2)}</div>
            <p className="text-xs text-gray-500">Disponível</p>
          </CardContent>
        </Card>

        {/* Checkout Fee Card */}
        <Card className="border-l-4 border-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Taxa de Checkout</CardTitle>
            <ClipboardList className="h-5 w-5 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{walletData.checkoutFee}%</div>
            <div className="flex items-center mt-2">
              <Progress value={walletData.checkoutFee} className="w-full mr-2" />
              <span className="text-xs text-gray-500">{walletData.checkoutFee}%</span>
            </div>
          </CardContent>
        </Card>

        {/* Pending Payments Card */}
        <Card className="border-l-4 border-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Pagamentos Pendentes</CardTitle>
            <MessageSquare className="h-5 w-5 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{walletData.pendingPayments}</div>
            <p className="text-xs text-gray-500">Aguardando confirmação</p>
          </CardContent>
        </Card>
      </div>

      {/* Withdrawal Form */}
      <Card>
        <CardHeader>
          <CardTitle>Sacar Dinheiro</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <form className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="amount">Valor</Label>
                <Input 
                  id="amount" 
                  type="number" 
                  placeholder="Ex: 100.00" 
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="paymentMethod">Método de Saque</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecione um método" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M-pesa">M-pesa</SelectItem>
                    <SelectItem value="E-Mola">E-Mola</SelectItem>
                    <SelectItem value="M-Khesh">M-Khesh</SelectItem>
                    <SelectItem value="MillenimBim">MillenimBim</SelectItem>
                    <SelectItem value="BCI">BCI</SelectItem>
                    <SelectItem value="EcoBank">EcoBank</SelectItem>
                    <SelectItem value="StandardBank">StandardBank</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="accountNumber">Número da Conta</Label>
                <Input 
                  id="accountNumber" 
                  type="text" 
                  placeholder="Digite o número da conta" 
                  className="mt-1"
                />
              </div>
              
              <div className="flex items-end h-full pt-2">
                <Button type="submit" className="w-full">
                  <ArrowDownUp className="mr-2 h-4 w-4" /> Sacar
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Spacer - Separação visual */}
      <div className=" my-1"></div>

      {/* Transaction History */}
      <Card className="flex-1 min-h-0">
        <CardHeader>
          <CardTitle>Histórico de Transações</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 flex flex-col h-full">
          
          <div className="border rounded-lg overflow-hidden flex-1">
            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader className="bg-gray-100 sticky top-0">
                  <TableRow>
                    <TableHead className="whitespace-nowrap">Valor</TableHead>
                    <TableHead className="whitespace-nowrap">Tipo</TableHead>
                    <TableHead className="whitespace-nowrap">Conta de Origem</TableHead>
                    <TableHead className="whitespace-nowrap">Conta de Destino</TableHead>
                    <TableHead className="whitespace-nowrap">Referência</TableHead>
                    <TableHead className="whitespace-nowrap">App ID</TableHead>
                    <TableHead className="whitespace-nowrap">Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {walletData.transactions.map((transaction, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium whitespace-nowrap">${transaction.value.toFixed(2)}</TableCell>
                      <TableCell className="whitespace-nowrap">{transaction.type}</TableCell>
                      <TableCell className="whitespace-nowrap">{transaction.originAccount}</TableCell>
                      <TableCell className="whitespace-nowrap">{transaction.destinationAccount}</TableCell>
                      <TableCell className="whitespace-nowrap">{transaction.transactionReference}</TableCell>
                      <TableCell className="whitespace-nowrap">{transaction.appId}</TableCell>
                      <TableCell className="whitespace-nowrap">{transaction.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    
        {/* Footer da Página */}
        <div className="text-center text-gray-500 text-sm py-4 my-2">
          <p>Copyright © VOIDpay 2024</p>
        </div>
    </div>
  );
}