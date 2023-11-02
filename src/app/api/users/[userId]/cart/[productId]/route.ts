import { UpdateCartItemResponse, updateCartItem } from '@/lib/handlers';
import { DeleteCartItemResponse, deleteCartItem } from '@/lib/handlers';
import { Types } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { NonNullChain } from 'typescript';
import { Session } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';

export async function PUT(
  request: NextRequest,
  {
    params,
  }: {
    params: { userId: string; productId: string };
  }
): Promise<NextResponse<UpdateCartItemResponse> | null | {}> {
  const body = await request.json();

  if(!(Types.ObjectId.isValid(params.userId)&&Types.ObjectId.isValid(params.productId))){
    return NextResponse.json({}, { status: 400 });
  }

  const session: Session | null = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({}, { status: 401 });
  }

  if (!body.qty || !params.userId || !params.productId) {
    return NextResponse.json({}, { status: 400 });
  }

  if (params.userId == null || params.productId == null) {
    return NextResponse.json({}, { status: 400 });
  }

  if (session.user._id !== params.userId) {
    return NextResponse.json({}, { status: 403 });
  }

  const output = await updateCartItem(
    params.userId,
    params.productId,
    body.qty
  );

  const cartItems = output?.cartItems;
  const created = output?.created;

  if (cartItems === null) return NextResponse.json({}, { status: 400 });

  if (created) return NextResponse.json(cartItems, { status: 201 });
  else return NextResponse.json(cartItems, { status: 200 });
}

export async function DELETE(
  request: NextRequest,
  {
    params,
  }: {
    params: { userId: string; productId: string };
  }
): Promise<NextResponse<DeleteCartItemResponse> | null | {}> {
  const session: Session | null = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({}, { status: 401 });
  }

  if (!params.userId || !params.productId) {
    return NextResponse.json({}, { status: 400 });
  }

  if (params.userId == null || params.productId == null) {
    return NextResponse.json({}, { status: 400 });
  }

  if (session.user._id !== params.userId) {
    return NextResponse.json({}, { status: 403 });
  }

  if (!(Types.ObjectId.isValid(params.userId) && Types.ObjectId.isValid(params.productId))) {
    return NextResponse.json({}, { status: 400 });
  }

  const cartItems = await deleteCartItem(params.userId, params.productId);

  if (null) return NextResponse.json({}, { status: 404 });

  return NextResponse.json(cartItems, { status: 200 });
}
