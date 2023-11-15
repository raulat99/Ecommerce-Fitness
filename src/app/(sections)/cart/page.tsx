import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { notFound, redirect } from 'next/navigation';
import { Session } from 'next-auth';
import { CartResponse, getCart } from '@/lib/handlers';
import Link from 'next/link';
import {
  TrashIcon,
} from '@heroicons/react/24/outline';

export const dynamic = 'force-dynamic';

export default async function Cart() {
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
                <div className='flex flex-col items-center justify-between space-y-3 p-4 md:flex-row md:space-x-4 md:space-y-0'>
                  <div className='w-full md:w-1/2'>
                    <form className='flex items-center'>
                      <label htmlFor='simple-search' className='sr-only'>
                        Search
                      </label>
                      <div className='relative w-full'>
                        <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                          <svg
                            aria-hidden='true'
                            className='h-5 w-5 text-gray-500 '
                            fill='currentColor'
                            viewBox='0 0 20 20'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              fillRule='evenodd'
                              d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z'
                              clipRule='evenodd'
                            />
                          </svg>
                        </div>
                        <input
                          type='text'
                          id='simple-search'
                          className='focus:ring-primary-500 focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 pl-10 text-sm text-gray-900 '
                          placeholder='Search'
                        />
                      </div>
                    </form>
                  </div>
                </div>
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
                            <td className='px-4 py-3'>
                              <div className='relative mt-1 flex h-10 w-full flex-row rounded-lg bg-transparent'>
                                <button className=' h-full w-20 cursor-pointer rounded-l bg-gray-100 text-gray-600 outline-none hover:bg-gray-400 hover:text-gray-700'>
                                  <span className='m-auto text-2xl font-thin'>
                                    −
                                  </span>
                                </button>
                                <input
                                  type='number' className='text-md md:text-basecursor-default flex w-full items-center text-center font-semibold text-gray-700  outline-none outline-none hover:text-black focus:text-black  focus:outline-none' name='custom-input-number' value={cartItem.qty}
                                ></input>
                                <button
                                  data-action='increment'
                                  className='h-full w-20 cursor-pointer rounded-r bg-gray-100 text-gray-600 hover:bg-gray-400 hover:text-gray-700'
                                >
                                  <span className='m-auto text-2xl font-thin'>
                                    +
                                  </span>
                                </button>
                                <TrashIcon className='text-black-100 bg-red-100'></TrashIcon>
                              </div>
                            </td>
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
            </div>
          </section>
          <div className='text-center my-4'>
              <button className='rounded-full bg-gray-900 px-4 py-2 font-bold text-white hover:bg-gray-700'>
                <Link href='/checkout'>Check out</Link>
              </button>
            </div>
        </>
      )}
    </div>
  );
}