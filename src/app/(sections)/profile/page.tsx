import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { notFound, redirect } from 'next/navigation';
import { Session } from 'next-auth';
import { UserResponse, getUser } from '@/lib/handlers';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Profile() {
  const session: Session | null = await getServerSession(authOptions);

  if (!session) {
    redirect('/api/auth/signin');
  }

  const userData: UserResponse | null = await getUser(session.user._id);

  if (!userData) {
    notFound();
  }

  return (
    <div className='flex flex-col'>
      <h3 className='pb-4 text-3xl font-bold text-gray-900 sm:pb-6 lg:pb-8'>
        My Profile
      </h3>

      {userData && (
        <div>
          <span className='text-sm text-gray-400'>Name: {userData.name}</span>  
          <p>Email: {userData.email}</p>
          <p>Address: {userData.address}</p>
        </div>
      )}
      </div>

  );
}
