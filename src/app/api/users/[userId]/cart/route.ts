import { NextRequest, NextResponse } from 'next/server';
import { CartResponse, getCart } from '@/lib/handlers';
import { Session } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { Types } from 'mongoose';

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: { userId: string };
  }
): Promise<NextResponse<CartResponse> | {} | null> {
  const session: Session | null = await getServerSession(authOptions);



  if (!session?.user) {
    return NextResponse.json({}, { status: 401 });
  }

  if (!Types.ObjectId.isValid(params.userId)) {
    return NextResponse.json({}, { status: 400 });
  }
  if (session.user._id !== params.userId) {
    return NextResponse.json({}, { status: 403 });
  }

  const cart = await getCart(params.userId);

  if (params.userId === null) {
    return NextResponse.json({}, { status: 400 });
  }

  return NextResponse.json(cart);
}
