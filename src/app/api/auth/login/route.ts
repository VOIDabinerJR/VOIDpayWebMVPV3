// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { authService } from '@/lib/controllers/authController';

export async function POST(request: Request) {
  
  try {
    const body = await request.json();
    
    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    console.log('Corpo da requisição:', body); // Log adicional
    
    const result = await authService.login(body);
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