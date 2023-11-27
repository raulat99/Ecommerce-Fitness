'use client';
import { CartItemsContext } from '@/providers/CartItemsProvider';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';
import { useContext, useState } from 'react';

interface CartItemCounterProps {
  productId: string;
}

export default function CartItemCounter({ productId }: CartItemCounterProps) {
  const { data: session } = useSession({ required: true });
  const { cartItems, updateCartItems } = useContext(CartItemsContext);
  const [isUpdating, setIsUpdating] = useState(false);

  const cartItem = cartItems.find(
    (cartItem) => cartItem.product._id === productId
  );
  const qty = cartItem ? cartItem.qty : 0;

  const onPlusBtnClick = async function (event: React.MouseEvent) {
    setIsUpdating(true);

    try {
      const res = await fetch(
        `/api/users/${session!.user._id}/cart/${productId}`,
        {
          method: 'PUT',
          body: JSON.stringify({
            qty: qty + 1,
          }),
        }
      );

      if (res.ok) {
        const body = await res.json();
        updateCartItems(body.cartItems);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const onMinusBtnClick = async function (event: React.MouseEvent) {
    setIsUpdating(true);

    try {
      const res = await fetch(
        `/api/users/${session!.user._id}/cart/${productId}`,
        {
          method: 'PUT',
          body: JSON.stringify({
            qty: qty - 1,
          }),
        }
      );

      if (res.ok) {
        const body = await res.json();
        updateCartItems(body.cartItems);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const onDeleteBtnClick = async function (event: React.MouseEvent) {
    setIsUpdating(true);

    try {
      const res = await fetch(
        `/api/users/${session!.user._id}/cart/${productId}`,
        {
          method: 'DELETE'
        }
      );

      if (res.ok) {
        const body = await res.json();
        updateCartItems(body.cartItems);
      }
    } finally {
      setIsUpdating(false);
    }
  };


  return (
    <div className='custom-number-input mx-auto my-5 h-10 w-72'>
      <div className='relative flex h-10 w-full flex-row rounded-lg bg-transparent'>
        
        
        <button onClick={onMinusBtnClick} className='h-full w-20 cursor-pointer rounded-l bg-gray-300 text-gray-600 outline-none hover:bg-gray-400 hover:text-gray-700'>
          <span className='m-auto text-2xl font-thin'>−</span>
        </button>

        <span className='text-md inline-block flex h-full w-16 cursor-default items-center justify-center bg-gray-300 text-center font-semibold text-gray-700 outline-none hover:text-black focus:text-black md:text-base'>
          {qty}
        </span>

        <button onClick={onPlusBtnClick} className='h-full w-20 cursor-pointer bg-gray-300 text-gray-600 hover:bg-gray-400 hover:text-gray-700' disabled = {!session || isUpdating}>
          <span className='m-auto text-2xl font-thin'>+</span>
        </button>

        <div onClick={onDeleteBtnClick} className='flex h-full w-16 items-center justify-center rounded-r bg-gray-300 hover:bg-red-400'>
          <TrashIcon className='h-6 w-6 text-white'></TrashIcon>
        </div>
      </div>
    </div>
  );
}
