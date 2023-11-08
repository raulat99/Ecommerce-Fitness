import { Types } from 'mongoose';
import { notFound } from 'next/navigation';
import { getProduct } from '@/lib/handlers';

export default async function Product({
  params,
}: {
  params: { productId: string };
}) {
  if (!Types.ObjectId.isValid(params.productId)) {
    notFound();
  }

  const product = await getProduct(params.productId);

  if (product === null) {
    notFound();
  }

  return (
    <div className='flex flex-col sm:flex-row'>
      <div className='max-w-md'>
        <img
          src={product.img}
          alt={product.name}
          className='w-full rounded-lg object-cover object-center group-hover:opacity-75'
        />

        <div className='my-5 ml-3'>
          {product.price && (
            <p
              style={{
                fontSize: '56px',
                fontFamily: 'Roboto, sans-serif'
              }}
            >
              {product.price + ' €'}
            </p>
          )}
        </div>
      </div>

      <div className='w-full sm:w-1/2'>
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
