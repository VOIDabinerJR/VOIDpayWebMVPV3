// app/api/order/updateOrder/route.ts
import { NextResponse } from 'next/server';
import { userService } from '@/lib/controllers/userController';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await userService.shopifyCredentials(body);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}