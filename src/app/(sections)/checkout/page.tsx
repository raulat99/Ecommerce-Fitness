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
        <>
          <section className='bg-gray-50 p-3 sm:p-5'>
            <div className='mx-auto max-w-screen-xl px-4 lg:px-12'>
              <div className='relative overflow-hidden bg-white shadow-md sm:rounded-lg'>
                <div className='overflow-x-auto'>
                  <table className='w-full text-left text-sm text-gray-500 '>
                    <thead className='bg-gray-50 text-xs uppercase text-gray-700'>
                      <tr>
                        <th scope='col' className='px-4 py-3'>
                          Product name
                        </th>
                        <th scope='col' className='px-4 py-3'>
                          Quantity
                        </th>
                        <th scope='col' className='px-4 py-3'>
                          Price
                        </th>
                        <th scope='col' className='px-4 py-3'>
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItemsData.cartItems.map((cartItem: any) => (
                        <>
                          <tr className='border-b'>
                            <td className='px-4 py-3'>
                              <Link href={`/products/${cartItem.product._id}`}>
                                {cartItem.product.name}
                              </Link>
                            </td>
                            <td className='px-4 py-3'> {cartItem.qty}</td>
                            <td className='px-4 py-3'>
                              {cartItem.product.price.toFixed(2) + ' €'}
                            </td>
                            <td className='px-4 py-3'>
                              {cartItem.product.price.toFixed(2) *
                                cartItem.qty +
                                ' €'}
                            </td>
                          </tr>
                        </>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className='border-b'>
                        <td className='px-4 py-3'> Total </td>
                        <td className='px-4 py-3'> </td>
                        <td className='px-4 py-3'> </td>
                        <td className='px-4 py-3'> 123 €</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
              <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>

              <div className='sm:col-span-6'>
                <label className='block text-sm font-medium leading-6 text-gray-900'>
                  Shipping address
                </label>
                <input type='text' name='first-name' id='first-name' className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'/>
              </div>
              </div>

              <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
              <div className='sm:col-span-3'>
                <label className='block text-sm font-medium leading-6 text-gray-900'>
                  Card Holder
                </label>
                <input type='text' name='first-name' id='first-name' className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'/>
              </div>

              <div className='sm:col-span-3'>
                <label className='block text-sm font-medium leading-6 text-gray-900'>
                  Card Number
                </label>
                <input type='text' name='last-name' id='last-name' className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'/>
              </div>
            </div>
            <div className='my-8 text-center'>
            <button className='rounded-full bg-gray-900 px-4 py-2 font-bold text-white hover:bg-gray-700'>
              Purchase
            </button>
          </div>
            </div>
          </section>
          
        </>
      )}
    </div>
  );


}