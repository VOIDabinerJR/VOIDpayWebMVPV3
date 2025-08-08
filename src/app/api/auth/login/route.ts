// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { authService } from '@/lib/controllers/authController';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await authService.login(body);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
