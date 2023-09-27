import { OrdersResponse, getOrders } from '@/lib/handlers';
import { NextRequest, NextResponse } from 'next/server';
export async function GET(
request: NextRequest
): Promise<NextResponse<OrdersResponse>> {
const orders = await getOrders();
return NextResponse.json(orders);
}

