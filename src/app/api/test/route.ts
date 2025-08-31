// app/api/test/route.ts
// app/api/test-db/route.ts
import { Pool } from 'pg';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({
      status: 'success',
      message: 'API is working!',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({
      status: 'success',
      message: 'POST request received!',
      data: body,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Invalid request body' },
      { status: 400 }
    );
  }
}

export async function PUT() {
  // Configuração recomendada para o pool de conexões
const pool = new Pool({
  connectionString: "postgresql://company_db_r9xu_user:8YDLL4rGtk6X4xY9lvxNwzk9BvNMPY7Z@dpg-d2f0mqk9c44c739gq0n0-a.oregon-postgres.render.com/company_db_r9xu",
  ssl: {
    rejectUnauthorized: false // Necessário para Render.com
  },
 
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  // Configurações adicionais recomendadas:
  application_name: 'company_db', // Identifica sua aplicação no PostgreSQL
  query_timeout: 10000, // Timeout de 10 segundos para queries
});

// Eventos do pool para monitoramento
pool.on('connect', () => {
  console.log('Nova conexão estabelecida com o banco de dados');
});

pool.on('error', (err) => {
  console.error('Erro inesperado no pool de conexões:', err);
});

  let client;
  try {
    // 1. Conecta ao banco
    client = await pool.connect();
    
    // 2. Executa query de teste
    const result = await client.query(`
      SELECT 
        NOW() as current_time, 
        1+1 as test_calculation,
        current_database() as database_name,
        current_user as db_user
    `);
    
    // 3. Libera a conexão de volta para o pool
    client.release();
    
    // 4. Retorna resposta formatada
    return NextResponse.json({
      status: "success",
      data: {
        ...result.rows[0],
        connection: {
          pool_size: pool.totalCount,
          idle_connections: pool.idleCount,
        }
      },
    });

  } catch (error: any) {
    // Tratamento detalhado de erros
    const errorDetails = {
      code: error.code, // Código de erro PostgreSQL (ex: '28P01')
      severity: error.severity,
      position: error.position,
    };

    console.error('Database Error:', {
      error: error.message,
      query: error.query,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });

    return NextResponse.json({
      status: "error",
      message: "Falha na conexão com o banco de dados",
      details: {
        ...errorDetails,
        connection_config: {
          host: pool.options.host,
          port: pool.options.port,
          database: pool.options.database,
          user: pool.options.user,
        }
      }
    }, { 
      status: 500,
      headers: {
        'X-Error-Type': 'Database Connection',
      }
    });

  } finally {
    // Garante que a conexão seja liberada mesmo em caso de erro
    if (client && client.release) {
      client.release();
    }
    await pool.end();
  }
}