// app/api/order/updateOrder/route.ts
import { NextResponse } from 'next/server';
import { orderService } from '@/lib/controllers/orderController';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await orderService.createOrder(body);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

