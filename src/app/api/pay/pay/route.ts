// app/api/order/updateOrder/route.ts
import { NextResponse } from 'next/server';
import { payService } from '@/lib/controllers/payController';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await payService.processPayment(body);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
export async function GET(request: Request) {
  try {
    const body = await request.json();
    const result = await payService.getPaymentPage(body);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

