import { NextRequest, NextResponse } from 'next/server';
import { CartResponse, getCart } from '@/lib/handlers';
import { Session } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';


export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: { userId: string };
  }
): Promise<NextResponse<CartResponse> | {}> {

  const session: Session | null = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({}, { status: 401 });
  }

  const cart = await getCart(params.userId);

  if (params.userId === null) {
    return NextResponse.json({}, { status: 400 });
  }

  return NextResponse.json(cart);
}
