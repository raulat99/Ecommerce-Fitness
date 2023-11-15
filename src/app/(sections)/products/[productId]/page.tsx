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
      <div className='max-w-sm'>
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
                fontFamily: 'Roboto, sans-serif',
              }}
            >
              {product.price + ' €'}
            </p>
          )}
        </div>

        <div className='custom-number-input h-10 w-32 ml-5 my-5'>
          <div className='relative mt-1 flex h-10 w-full flex-row rounded-lg bg-transparent'>
            <button className=' h-full w-20 cursor-pointer rounded-l bg-gray-300 text-gray-600 outline-none hover:bg-gray-400 hover:text-gray-700'>
              <span className='m-auto text-2xl font-thin'>−</span>
            </button>

            <span className="outline-none focus:outline-none text-center w-full bg-gray-300 font-semibold text-md hover:text-black focus:text-black  md:text-basecursor-default flex items-center text-gray-700  outline-none">0</span>

            <button className='h-full w-20 cursor-pointer rounded-r bg-gray-300 text-gray-600 hover:bg-gray-400 hover:text-gray-700'>
              <span className='m-auto text-2xl font-thin'>+</span>
            </button>
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
