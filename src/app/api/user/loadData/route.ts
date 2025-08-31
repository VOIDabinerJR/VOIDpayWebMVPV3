// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { authService } from '@/lib/controllers/authController';

export async function POST(request: Request) {
  
  try {
    const body = await request.json();
    
    if (!body.token ) {
      return NextResponse.json(
        { error: 'Token required' },
        { status: 400 }
      );
    }

    
    const result = await authService.loadData(body);
    return NextResponse.json(result);
    
  } catch (error: any) {
    console.error('ERRO COMPLETO:', {
      message: error.message,
      stack: error.stack,
      rawError: error
    });

    return NextResponse.json(
      { error: 'Erro interno no servidor' }, // Mensagem genérica para o cliente
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  
  try {
    const body = await request.json();
    
    if (!body.token ) {
      return NextResponse.json(
        { error: 'Token required' },
        { status: 400 }
      );
    }

    
    const result = await authService.loadData(body);
    return NextResponse.json(result);
    
  } catch (error: any) {
    console.error('ERRO COMPLETO:', {
      message: error.message,
      stack: error.stack,
      rawError: error
    });

    return NextResponse.json(
      { error: 'Erro interno no servidor' }, // Mensagem genérica para o cliente
      { status: 500 }
    );
  }
}