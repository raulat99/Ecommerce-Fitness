import { Types } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { getOrder, OrderResponse } from '@/lib/handlers';

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: { orderId: string };
  }
): Promise<OrderResponse | {}> {
  if (!Types.ObjectId.isValid(params.orderId)) {
    return NextResponse.json({}, { status: 400 });
  }

  const order = await getOrder(params.orderId);

  if (order === null) {
    return NextResponse.json({}, { status: 404 });
  }

  return NextResponse.json(order);
}