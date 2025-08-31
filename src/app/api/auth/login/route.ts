// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { authService } from '@/lib/controllers/authController';

export async function POST(request: Request) {
  try {
    // Verifica se há conteúdo no corpo
    const contentLength = request.headers.get('content-length');

    if (!contentLength || parseInt(contentLength) === 0) {
      return NextResponse.json(
        { error: 'Request body is required' },
        { status: 400 }
      );
    }

    // Tenta parsear o JSON
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid JSON format' },
        { status: 400 }
      );
    }

    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    console.log('Corpo da requisição:', body);

    const result = await authService.login(body);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('ERRO INTERNO:', {
      message: error.message,
      stack: error.stack
    });

    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
