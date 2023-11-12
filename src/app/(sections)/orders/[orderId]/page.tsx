import { Types } from 'mongoose';
import { OrderResponse, getOrder, getProduct } from '@/lib/handlers';
import { Session, getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import {
    TrashIcon,
    BuildingOfficeIcon,
    CreditCardIcon,
    CalendarIcon,
    ShoppingCartIcon
  } from '@heroicons/react/24/outline';


export const dynamic = 'force-dynamic';


export default async function Order({
  params, 
}: {
  params: { orderId: string };
}) {
  const session: Session | null = await getServerSession(authOptions);

  if (!session) {
    redirect('/api/auth/signin');
  }

  if (!Types.ObjectId.isValid(params.orderId)) {
    notFound();
  }

  const order = await getOrder(session.user._id, params.orderId);

  console.log(order)

  const orderData: OrderResponse | null = await getOrder(
    session.user._id, params.orderId
  );

  if (order === null) {
    notFound();
  }

  return (
    <div className='flex flex-col'>
      <h3 className='pb-4 text-3xl font-bold text-gray-900 sm:pb-6 lg:pb-8'>
        Order Details
      </h3>

      <div className='flex'>
        <ShoppingCartIcon className='text-black-10 block h-8 w-auto text-xs' />
        <label className='block text-sm font-bold leading-6 text-gray-900'>
          Order ID: {order._id}
        </label>
      </div>
      <div className='flex'>
        <BuildingOfficeIcon className='text-black-10 block h-8 w-auto text-xs' />
        <label className='block text-sm font-bold leading-6 text-gray-900'>
          Shipping address: {order.address}
        </label>
      </div>
      <div className='flex'>
        <CreditCardIcon className='text-black-10 block h-8 w-auto text-xs' />
        <label className='block text-sm font-bold leading-6 text-gray-900'>
          Payment information: {order.cardNumber} ({order.cardHolder})
        </label>
      </div>
      <div className='flex'>
        <CalendarIcon className='text-black-10 block h-8 w-auto text-xs' />
        <label className='block text-sm font-bold leading-6 text-gray-900'>
          Date of purchase: {order.date.toString()}
        </label>
      </div>

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
                  {order.orderItems.map((orderItem: any) => (
                    <>
                      <tr className='border-b'>
                        <td className='px-4 py-3'>
                          <Link href={`/products/${orderItem.product._id}`}>
                            {orderItem.product.name}
                          </Link>
                        </td>
                        <td className='px-4 py-3'> {orderItem.qty}</td>
                        <td className='px-4 py-3'>
                          {orderItem.price.toFixed(2) + ' €'}
                        </td>
                        <td className='px-4 py-3'>
                          {orderItem.price.toFixed(2) * orderItem.qty + ' €'}
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
    </div>
  );
}