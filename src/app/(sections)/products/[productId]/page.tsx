import { Types } from 'mongoose';
import { notFound } from 'next/navigation';
import { getProduct } from '@/lib/handlers';
import { TrashIcon } from '@heroicons/react/24/outline';

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
      <div className='mx-auto max-w-sm'>
        <img
          src={product.img}
          alt={product.name}
          className='w-full rounded-lg object-cover object-center group-hover:opacity-75'
        />

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

        <div className='custom-number-input mx-auto my-5 h-10 w-72'>
          <div className='relative flex h-10 w-full flex-row rounded-lg bg-transparent'>
            <button className='h-full w-20 cursor-pointer rounded-l bg-gray-300 text-gray-600 outline-none hover:bg-gray-400 hover:text-gray-700'>
              <span className='m-auto text-2xl font-thin'>−</span>
            </button>

            <span className='text-md inline-block flex h-full w-16 cursor-default items-center justify-center bg-gray-300 text-center font-semibold text-gray-700 outline-none hover:text-black focus:text-black md:text-base'>
              0
            </span>

            <button className='h-full w-20 cursor-pointer bg-gray-300 text-gray-600 hover:bg-gray-400 hover:text-gray-700'>
              <span className='m-auto text-2xl font-thin'>+</span>
            </button>

            <div className='flex h-full w-16 items-center justify-center rounded-r bg-gray-300 hover:bg-red-400'>
              <TrashIcon className='h-6 w-6 text-white'></TrashIcon>
            </div>
          </div>
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
