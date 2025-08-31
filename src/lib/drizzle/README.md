# Models Drizzle ORM - PostgreSQL

Este projeto contém a conversão dos models originais para usar Drizzle ORM com PostgreSQL.

## Estrutura do Projeto

```
drizzle/
├── schema.ts              # Definições das tabelas
├── db.ts                  # Configuração da conexão com o banco
├── index.ts               # Exportações principais
├── drizzle.config.ts      # Configuração do Drizzle Kit
├── package.json           # Dependências do projeto
├── README.md              # Esta documentação
└── models/                # Models convertidos
    ├── userModel.ts
    ├── productModel.ts
    ├── orderModel.ts
    ├── notificationModel.ts
    ├── walletModel.ts
    ├── userDetailsModel.ts
    ├── businessModel.ts
    ├── statisticsModel.ts
    ├── dynamicDataModel.ts
    ├── buttonModel.ts
    ├── appModel.ts
    └── shopifyModel.ts
```

## Instalação

1. Instale as dependências:
```bash
npm install
```

2. Configure a variável de ambiente `DATABASE_URL`:
```bash
export DATABASE_URL= "postgresql://company_db_r9xu_user:8YDLL4rGtk6X4xY9lvxNwzk9BvNMPY7Z@dpg-d2f0mqk9c44c739gq0n0-a.oregon-postgres.render.com/company_db_r9xu"

## Uso

### Importando os models

```typescript
import { User, Product, Order } from './drizzle';
// ou
import User from './drizzle/userModel';
```

### Exemplo de uso

```typescript
import { User } from './drizzle';

// Buscar usuário por email
const user = await User.findByEmail('user@example.com');

// Criar novo usuário
const newUser = await User.create({
  email: 'newuser@example.com',
  userStatus: true
});

// Atualizar usuário
const updatedUser = await User.update(1, {
  email: 'updated@example.com'
});
```

## Principais Mudanças

### 1. Sintaxe de Query
- **Antes (MySQL)**: `db.query('SELECT * FROM user WHERE email = ?', [email])`
- **Depois (Drizzle)**: `db.select().from(users).where(eq(users.email, email))`

### 2. Tipos TypeScript
- Todos os models agora têm tipagem completa
- Uso de `$inferInsert` e `$inferSelect` para tipos automáticos

### 3. Operações de Banco
- **INSERT**: `db.insert(table).values(data).returning()`
- **SELECT**: `db.select().from(table).where(condition)`
- **UPDATE**: `db.update(table).set(data).where(condition).returning()`
- **DELETE**: `db.delete(table).where(condition).returning()`

### 4. Relacionamentos
- Definidos no schema com referências apropriadas
- Queries com joins usando sintaxe do Drizzle

## Comandos Úteis

```bash
# Gerar migrações
npm run generate

# Executar migrações
npm run migrate

# Abrir Drizzle Studio
npm run studio
```

## Observações Importantes

1. **Transações**: Para operações complexas como no `walletModel`, será necessário implementar uma tabela de transações no schema.

2. **Validações**: Considere adicionar validações usando bibliotecas como Zod junto com o Drizzle.

3. **Performance**: O Drizzle oferece melhor performance e type-safety comparado às queries SQL diretas.

4. **Migrações**: Use o Drizzle Kit para gerenciar mudanças no schema do banco de dados.

## Compatibilidade

- ✅ PostgreSQL 12+
- ✅ Node.js 16+
- ✅ TypeScript 4.5+
- ✅ Drizzle ORM 0.29+

