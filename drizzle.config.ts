// drizzle.config.ts
import type { Config } from 'drizzle-kit';
import dotenv from 'dotenv';

dotenv.config();

export default {
  schema: './src/lib/db/schema.ts',
  out: './src/lib/db/migrations',
  dialect: 'postgresql', // Especifica o dialeto PostgreSQL
  dbCredentials: {
    url: process.env.DATABASE_URL! // Use a URL de conexão do seu PostgreSQL
    // Ou se preferir configurar manualmente:
    // host: process.env.DB_HOST,
    // user: process.env.DB_USER,
    // password: process.env.DB_PASSWORD,
    // database: process.env.DB_NAME,
  },
  // Configurações adicionais para PostgreSQL
  verbose: true,
  strict: true
} satisfies Config;
