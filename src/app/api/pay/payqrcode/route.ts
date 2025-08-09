// app/api/order/updateOrder/route.ts
import { NextResponse } from 'next/server';
import { payService } from '@/lib/controllers/payController';

export async function GET(request: Request) {
  try {
    const body = await request.json();
    const result = await payService.getQrCode(body);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

