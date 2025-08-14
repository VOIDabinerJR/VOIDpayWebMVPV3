// scripts/migrate.ts
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../src/lib/drizzle/schema";

const pool = new Pool({
  connectionString:"postgresql://company_db_r9xu_user:8YDLL4rGtk6X4xY9lvxNwzk9BvNMPY7Z@dpg-d2f0mqk9c44c739gq0n0-a.oregon-postgres.render.com/company_db_r9xu",
  ssl: {
    rejectUnauthorized: false // Necessário para Render.com
  },
  max: 1 // Importante para migrações
});

const db = drizzle(pool, { schema });

async function main() {
  console.log("Migrando banco de dados...");
  await migrate(db, { migrationsFolder: "./drizzle/migrations" });
  console.log("Migração concluída com sucesso!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Erro na migração:", err);
  process.exit(1);
});