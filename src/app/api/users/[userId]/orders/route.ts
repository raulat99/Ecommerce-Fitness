import { CreateOrderResponse, OrdersResponse, getOrders, getUser } from '@/lib/handlers';
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


/*

export async function POST(request :NextRequest,
    {
        params,
    }: {
        params: {userId: string};
    }):
    Promise<NextResponse<CreateOrderResponse> |{}> {
    
    const body = await request.json();

    if (!body.date || !body.address || !body.cardHolder || !body.cardNumber || !body.orderItems) {
        return NextResponse.json({}, { status: 400 });
      }

    if (params.userId === null) {
    return NextResponse.json({}, { status: 400 });
    }
    
    const headers = new Headers();

}

/*

export async function POST(
  request: NextRequest
): Promise<NextResponse<CreateUserResponse> | {}> {
  const body = await request.json();

  if (!body.email || !body.password || !body.name || !body.surname || !body.address || !body.birthdate) {
    return NextResponse.json({}, { status: 400 });
  }

  const userId = await createUser(body);

  if (userId === null) {
    return NextResponse.json({}, { status: 400 });
  }

  const headers = new Headers();
  headers.append('Location', `/api/users/${userId._id}`);
  return NextResponse.json({ _id: userId._id }, { status: 201, headers: headers });
}




*/