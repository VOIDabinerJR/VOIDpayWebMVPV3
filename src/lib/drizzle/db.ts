import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://company_db_r9xu_user:8YDLL4rGtk6X4xY9lvxNwzk9BvNMPY7Z@dpg-d2f0mqk9c44c739gq0n0-a.oregon-postgres.render.com/company_db_r9xu",
  ssl: {
    rejectUnauthorized: false // Obrigatório para Render.com
  },
  max: 3, // Conexões simultâneas (adequado para plano gratuito)
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000, // Timeout aumentado
});

// Monitoramento do pool
pool.on('connect', () => {
  console.log('Nova conexão estabelecida com o banco de dados');
});

pool.on('error', (err) => {
  console.error('Erro no pool de conexões:', err);
});

export const db = drizzle(pool, { schema });