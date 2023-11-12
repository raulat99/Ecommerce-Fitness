import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { notFound, redirect } from 'next/navigation';
import { Session } from 'next-auth';
import {
  OrdersResponse,
  UserResponse,
  getUser,
  getOrders,
} from '@/lib/handlers';
import Link from 'next/link';
import {
  UserIcon,
  EnvelopeIcon,
  BuildingStorefrontIcon,
  CakeIcon,
} from '@heroicons/react/24/outline';

export const dynamic = 'force-dynamic';

export default async function Profile() {
  const session: Session | null = await getServerSession(authOptions);

  if (!session) {
    redirect('/api/auth/signin');
  }

  const userData: UserResponse | null = await getUser(session.user._id);

  const orderData: OrdersResponse | null = await getOrders(session.user._id);

  if (!userData || !orderData) {
    notFound();
  }

  return (
    <div className='flex flex-col'>
      <h2 className='pb-4 text-3xl font-bold text-gray-900 sm:pb-6 lg:pb-8'>
        My Profile
      </h2>
      <div className='flex flex-col'>
        <div className='flex flex-row'>
          <UserIcon className='h-6 w-6' />
          <span className='ml-5 text-sm font-bold text-gray-900'>
            Full Name:{' '}
          </span>
          <span className='ml-5 text-sm text-gray-500'>
            {' '}
            {userData.name + ' ' + userData.surname}
          </span>
        </div>

        <div className='flex flex-row'>
          <EnvelopeIcon className='h-6 w-6' />
          <span className='ml-5 text-sm font-bold text-gray-900'>Email: </span>
          <span className='ml-5 text-sm text-gray-500'> {userData.email}</span>
        </div>

        <div className='flex flex-row'>
          <BuildingStorefrontIcon className='h-6 w-6' />
          <span className='ml-5 text-sm font-bold text-gray-900'>Address:</span>
          <span className='ml-5 text-sm text-gray-500'>{userData.address}</span>
        </div>

        <div className='flex flex-row'>
          <CakeIcon className='h-6 w-6' />
          <span className='ml-5 text-sm font-bold text-gray-900'>
            Birthdate:{' '}
          </span>
          <span className='ml-5 text-sm text-gray-500'>
            {userData.birthdate.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>
      </div>
      <h2 className='my-7 pb-4 text-2xl font-bold text-gray-900 sm:pb-6 lg:pb-8'>
        Orders
      </h2>

      <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
        <table className='w-full text-left text-sm text-gray-500'>
          <thead className='bg-gray-300 text-xs uppercase text-gray-700'>
            <tr>
              <th scope='col' className='px-6 py-3'>
                Order ID
              </th>
              <th scope='col' className='px-6 py-3'>
                Shipment Address
              </th>
              <th scope='col' className='px-6 py-3'>
                Payment Information
              </th>
              <th scope='col' className='px-6 py-3'>
              </th>
            </tr>
          </thead>
          <tbody>
            {orderData.orders.map((order) => (
              <tr key={order._id.toString()} className="bg-gray-200 border-b">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {order._id.toString()}
                </th>
                <td className='whitespace-nowrap px-6 py-4'>{order.address}</td>
                <td className='whitespace-nowrap px-6 py-4'>
                  Esto hay que modificarlo
                </td>
                <td className='whitespace-nowrap px-6 py-4'>View Details</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
