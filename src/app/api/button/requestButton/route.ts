// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import buttonService from '@/lib/controllers/buttonController';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await buttonService.requestButton(body);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
