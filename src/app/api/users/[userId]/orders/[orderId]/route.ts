import { Types } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { getOrder, getUser, OrderResponse } from '@/lib/handlers';

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: { userId:string, orderId: string };
  }
): Promise<OrderResponse | {}> {
  if (!Types.ObjectId.isValid(params.userId)) {
    return NextResponse.json({}, { status: 400 });
  }

  const user = await getUser(params.userId);

  if (user === null) {
    return NextResponse.json({}, { status: 404 });
  }

  const order = await getOrder(params.userId, params.orderId);

  
  return NextResponse.json(order);
}