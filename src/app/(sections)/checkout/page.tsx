import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { notFound, redirect } from 'next/navigation';
import { Session } from 'next-auth';
import {
  CartResponse,
  getCart,
} from '@/lib/handlers';
import Link from 'next/link';
import {
    TrashIcon,
  } from '@heroicons/react/24/outline';
import CartItemPurchase from '@/components/CartItemPurchase';
  

export const dynamic = 'force-dynamic';

export default async function Checkout() {
  const session: Session | null = await getServerSession(authOptions);

  if (!session) {
    redirect('/api/auth/signin');
  }

  const cartItemsData: CartResponse | null = await getCart(
    session.user._id
  );

  if (!cartItemsData) {
    notFound();
  }

  var precioTotal = 0;  
  cartItemsData.cartItems.map((cartItem:any)=>{
      precioTotal = precioTotal + cartItem.product.price * cartItem.qty;
    });

  return (
    <div className='flex flex-col'>
      <h3 className='pb-4 text-3xl font-bold text-gray-900 sm:pb-6 lg:pb-8'>
        My Shopping Cart
      </h3>

      {cartItemsData.cartItems.length === 0 ? (
        <div className='text-center'>
          <span className='text-sm text-gray-400'>The cart is empty</span>
        </div>
      ) : (
        <CartItemPurchase/>
      )}
    </div>
  );


}