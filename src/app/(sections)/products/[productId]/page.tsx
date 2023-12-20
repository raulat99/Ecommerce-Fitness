import { Types } from 'mongoose';
import { notFound } from 'next/navigation';
import { getProduct } from '@/lib/handlers';
import { TrashIcon } from '@heroicons/react/24/outline';
import { Session, getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { CartItemsContext } from '@/providers/CartItemsProvider';
import CartItemCounter from '@/components/CartItemCounter';
import CartItemCounterWrapper from '@/components/CartItemCounterWrapper';

export default async function Product({
  params,
}: {
  params: { productId: string };
}) {
  if (!Types.ObjectId.isValid(params.productId)) {
    notFound();
  }

  const product = await getProduct(params.productId);
  const session: Session | null = await getServerSession(authOptions);

  if (product === null) {
    notFound();
  }

  return (
    <div className='flex flex-col sm:flex-row'>
      <div className='mx-auto max-w-sm'>
        <img src={product.img} alt={product.name} className='h-1/2 w-1/2' />

        <div className='my-5 text-center'>
          {product.price && (
            <p
              style={{
                fontSize: '56px',
                fontFamily: 'Roboto, sans-serif',
              }}
            >
              {product.price + ' €'}
            </p>
          )}
        </div>
        <div className='flex justify-center'>
          <CartItemCounterWrapper productId={params.productId}>
            <CartItemCounter productId={params.productId} />
          </CartItemCounterWrapper>
        </div>
      </div>

      <div className='ml-5 w-full sm:w-1/2'>
        <h3 className='pb-4 text-3xl font-bold text-gray-900 sm:pb-6 lg:pb-8'>
          {product.name}
        </h3>

        <div>
          <p className='font-bold'>Product Details</p>
          {product.description && <p>{product.description}</p>}
        </div>
      </div>
    </div>
  );
}
