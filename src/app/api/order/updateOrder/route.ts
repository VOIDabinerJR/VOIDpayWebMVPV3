// app/api/order/updateOrder/route.ts
import { NextResponse } from 'next/server';
import { orderService } from '@/lib/controllers/orderService';

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const result = await orderService.updateOrder(body);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

