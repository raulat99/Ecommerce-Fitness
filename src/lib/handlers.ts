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

//UpdateCartItem function to perform PUT operation

export async function updateCartItem(
  userId: string,
  productId: string,
  qty: number
): Promise<UpdateCartItemResponse | null> {
  await connect();
  var created;

  const product = await Products.findById(productId);
  if (product === null) return null;

  const user = await Users.findById(userId);
  if (user === null) return null;

  const cartItem = user.cartItems.find(
    (cartItem: any) =>
      cartItem.product._id.equals(productId)
  );

  if (cartItem) {
    //TRUE: Cambiamos la cantidad
    cartItem.qty = qty
    created = false
  } else {
    //cambiamos la cantidad
    const newCartItem = {
      product: new Types.ObjectId(productId),
      qty: qty
    }

    user.cartItems.push(newCartItem);
    created = true
  }

  await user.save();

  const userProjection = {
    _id: false,
    cartItems: true
  }

  const productProjection = {
    name: true,
    price: true
  };

  const updatedUser = await Users
    .findById(userId, userProjection).populate("cartItems.product", productProjection)

  const output = {
    cartItems: updatedUser,
    created: created
  };

  return output; //// tenemos que devolver un boolean tambien
}


export async function deleteCartItem(
  userId: string,
  productId: string
): Promise<DeleteCartItemResponse | null> {
  await connect();

  const product = await Products.findById(productId);
  if (product === null) return null;

  const user = await Users.findById(userId);
  if (user === null) return null;

  const index = user.cartItems.findIndex(
    (cartItem: any) =>
      cartItem.product._id.equals(productId)
  );

  if (index === -1) return null;

  user.cartItems.splice(index, 1);

  await user.save();

  const userProjection = {
    _id: false,
    cartItems: true
  }

  const productProjection = {
    name: true,
    price: true
  };

  const updatedUser = await Users
    .findById(userId, userProjection).populate("cartItems.product", productProjection)

  return updatedUser;
}

export interface UserResponse {
  email: string;
  name: string;
  surname: string;
  address: string;
  birthdate: Date;
}

export interface ProductResponse {
  name: true;
  description: true;
  price: true;
  img: true;
}

export interface UpdateCartItemResponse {
  cartItems: User['cartItems'],
  created: boolean;
}

export interface DeleteCartItemResponse {
  cartItems: User['cartItems'];
}

export interface CartResponse {
  cartItems: User['cartItems'];
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



export async function getCart(userId: string): Promise<CartResponse | null> {
  await connect();

  const productProjection = {
    name: true,
    price: true,
  };

  const cartProjection = {
    cartItems: true,
  };

  const cart = await Users.findById(userId, cartProjection).populate(
    'cartItems.product',
    productProjection
  );

  if (cart == null) {
    return null;
  }

  return cart; 
}

export async function getProduct(
  productId: string
): Promise<ProductResponse | null> {
  await connect();

  const productProjection = {
    name: true,
    description: true,
    price: true,
    img: true,
  };
  const product = await Products.findById(productId, productProjection);

  if (product === null) {
    return null;
  }

  return product;
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