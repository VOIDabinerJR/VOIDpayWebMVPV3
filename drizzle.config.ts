// drizzle.config.ts
import type { Config } from 'drizzle-kit';
import dotenv from 'dotenv';

dotenv.config();

export default {
 schema: "./src/lib/drizzle/schema.ts", // caminho para seu schema
  out: "./drizzle/migrations", // pasta onde as migrations serão geradas
  dialect: 'postgresql', // Especifica o dialeto PostgreSQL
  // driver: "pg", // driver do PostgreSQL
  dbCredentials: {
    url:"postgresql://company_db_r9xu_user:8YDLL4rGtk6X4xY9lvxNwzk9BvNMPY7Z@dpg-d2f0mqk9c44c739gq0n0-a.oregon-postgres.render.com/company_db_r9xu"
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
