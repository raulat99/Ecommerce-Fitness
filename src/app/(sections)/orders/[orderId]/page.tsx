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
  ShoppingCartIcon,
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

  console.log(order);

  const orderData: OrderResponse | null = await getOrder(
    session.user._id,
    params.orderId
  );

  if (order === null) {
    notFound();
  }

  return (
    <div className='flex flex-col'>
      <h3 className='pb-4 text-3xl font-bold text-gray-900 sm:pb-6 lg:pb-8'>
        Order Details
      </h3>

      <div className='flex flex-row'>
        <ShoppingCartIcon className='h-6 w-6' />
        <span className='ml-5 text-sm font-bold text-gray-900'>Order ID: </span>
        <span className='ml-5 text-sm text-gray-500'> {order._id}</span>
      </div>
      <div className='flex flex-row'>
        <BuildingOfficeIcon className='h-6 w-6' />
        <span className='ml-5 text-sm font-bold text-gray-900'>
          Shipping Address:{' '}
        </span>
        <span className='ml-5 text-sm text-gray-500'> {order.address}</span>
      </div>
      <div className='flex flex-row'>
        <CreditCardIcon className='h-6 w-6' />
        <span className='ml-5 text-sm font-bold text-gray-900'>
          Payment Information:{' '}
        </span>
        <span className='ml-5 text-sm text-gray-500'>
          {' '}
          {order.cardHolder}, {order.cardNumber}
        </span>
      </div>
      <div className='flex flex-row'>
        <CalendarIcon className='h-6 w-6' />
        <span className='ml-5 text-sm font-bold text-gray-900'>
          Purchase Date:{' '}
        </span>
        <span className='ml-5 text-sm text-gray-500'>
          {order.date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </span>
      </div>

      <div className='relative my-6 overflow-x-auto shadow-md sm:rounded-lg'>
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
  );
}
