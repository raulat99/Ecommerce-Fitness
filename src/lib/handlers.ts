import Products, { Product } from '@/models/Product';
import connect from '@/lib/mongoose';
import Users, { User } from '@/models/User';
import { ObjectId, Types } from 'mongoose';
import Orders, { Order } from '@/models/Order';
import { TurboLoaderItem } from 'next/dist/server/config-shared';
import { ObjectType } from 'typescript';

export interface ProductsResponse {
  products: Product[];
}

export async function getProducts(): Promise<ProductsResponse> {
  await connect();
  const productProjection = {
    name: true,
    price: true,
    img: true,
  };
  const products = await Products.find({}, productProjection);
  return { products: products };
}

export interface CreateUserResponse {
  _id: Types.ObjectId | string;
}

export async function createUser(user: {
  email: string;
  password: string;
  name: string;
  surname: string;
  address: string;
  birthdate: Date;
}): Promise<CreateUserResponse | null> {
  await connect();

  const prevUser = await Users.find({ email: user.email });

  if (prevUser.length !== 0) {
    return null;
  }

  const doc: User = {
    ...user,
    birthdate: new Date(user.birthdate),
    cartItems: [],
    orders: [],
  };

  const newUser = await Users.create(doc);

  return {
    _id: newUser._id,
  };
}

export interface UserResponse {
  email: string;
  name: string;
  surname: string;
  address: string;
  birthdate: Date;
}

export async function getUser(userId: string): Promise<UserResponse | null> {
  await connect();

  const userProjection = {
    email: true,
    name: true,
    surname: true,
    address: true,
    birthdate: true,
  };
  const user = await Users.findById(userId, userProjection);

  if (user === null) {
    return null;
  }

  return user;
}


//PARA ORDERS DEL USERID
export interface OrdersResponse {
  orders: {date: Date;
  address: string;
  cardHolder: string;
  cardNumber: string;
  }[]
}

export async function getOrders(userId: string): Promise<OrdersResponse> {
  await connect();
  const orderProjection = {
    date: true,
    address: true,
    cardHolder: true,
    cardNumber: true,
  };
  const userProjection = {
    email: true,
    name: true,
    surname: true,
    address: true,
    birthdate: true,
    orders: true,
  };

  const user = await Users.findById(userId, userProjection).populate('orders', orderProjection)

  return {orders: user.orders};
}



//PARA ODERSID DEL ORDERS DEL USERID
export interface OrderItem{
  product: Types.ObjectId,
  qty: number,
  price: number,
}

export interface OrderResponse{
  date: Date;
  address: string;
  cardHolder: string;
  cardNumber: string;
  orderItems: OrderItem[];
}

export async function getOrder(userId: string, orderId: string): Promise<OrderResponse | any> {
  await connect();

  const orderProjection = {
    date: true,
    address: true,
    cardHolder: true,
    cardNumber: true,
    orderItems: true,
  };
  const orderItemProjection = {
    product: true,
    qty: true,
    price: true,
  };
  const userProjection = {
    _id: false,
    orders: true,
  };
  const productProjection = {
    name: true,
  };
  
  const user = await Users.findById(userId, userProjection)

  const orderIdElegido = user.orders.find((item: any) => item.toString() === orderId.toString())

  const orderElegido = await Orders.findById(orderIdElegido,orderProjection).populate('orderItems.product', productProjection)

  console.log(JSON.stringify(orderElegido, null,2));

  return {orderElegido};
}

//PARA CREAR UN ORDER
export interface CreateOrderResponse{
  _id: Types.ObjectId | string
}

export async function createOrder(order:{
  address: string;
  cardHolder: string;
  cardNumber: string;
}): Promise<CreateOrderResponse | null>{
  await connect();

  const prevOrder = await Orders.find({
    address: order.address,
    cardHolder: order.cardHolder,
    cardNumber: order.cardNumber,
  });

  if(prevOrder.length !== 0){return null;}

  const doc: Order = {
    ...order,
    date: new Date('1970-01-01'),
    orderItems: [],
  };

  const newOrder = await Orders.create(doc);

  return {
    _id: newOrder._id,
  };
}

/*
export async function createUser(user: {
  email: string;
  password: string;
  name: string;
  surname: string;
  address: string;
  birthdate: Date;
}): Promise<CreateUserResponse | null> {
  await connect();

  const prevUser = await Users.find({ email: user.email });

  if (prevUser.length !== 0) {
    return null;
  }

  const doc: User = {
    ...user,
    birthdate: new Date(user.birthdate),
    cartItems: [],
    orders: [],
  };

  const newUser = await Users.create(doc);

  return {
    _id: newUser._id,
  };
}

*/