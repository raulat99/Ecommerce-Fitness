import { NextRequest, NextResponse } from 'next/server';
import { CartResponse, getCart } from '@/lib/handlers';

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: { userId: string };
  }
): Promise<NextResponse<CartResponse> | {}> {
  
    const cart = await getCart(params.userId);
  
  if (params.userId === null) {
    return NextResponse.json({}, { status: 400 });
  }

  return NextResponse.json(
    cart
  );
}
