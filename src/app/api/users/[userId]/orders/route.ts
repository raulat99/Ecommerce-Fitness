import { CreateOrderResponse, OrdersResponse, createOrder, getOrders, getUser } from '@/lib/handlers';
import Users, {User} from '@/models/User';
import { Types } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
request: NextRequest,
{
  params,
}:{
  params: {userId: string}
}
): Promise<NextResponse<OrdersResponse | {}>> {

  if (!Types.ObjectId.isValid(params.userId)) {
    return NextResponse.json({}, { status: 400 });
  }
  const user = await getUser(params.userId);

  if (user === null) {
    return NextResponse.json({}, { status: 404 });
  }

  const orders = await getOrders(params.userId);

return NextResponse.json(orders);
}



export async function POST(request :NextRequest,
    {
        params,
    }: {
        params: {userId: string};
    }):
    Promise<NextResponse<CreateOrderResponse> | {}> {
    
    const body = await request.json();

    if (!body.address || !body.cardHolder || !body.cardNumber) {
        return NextResponse.json({}, { status: 400 });
      }

    if (params.userId === null) {
    return NextResponse.json({}, { status: 400 });
    }
    const orders = await createOrder(params.userId, body);

    const emptyCartTemporal = orders?.emptyCart;

    if(emptyCartTemporal){
      return NextResponse.json({}, { status: 400 });
    }

    if (orders === null){
      return NextResponse.json({}, { status: 404 });
    }

    const headers = new Headers();

    headers.append('Location', `/api/users/${params.userId}/orders`);

    return NextResponse.json({ _id: orders._id }, { status: 201, headers: headers });

}