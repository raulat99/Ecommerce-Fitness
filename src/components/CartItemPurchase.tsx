'use client';
import { CartItemsContext } from "@/providers/CartItemsProvider";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useContext, useState } from "react";
 
interface FormValues {
  address: string,
  cardHolder: string,
  cardNumber: string; 
}

export default function CartItemPurchase( ) {
    const router = useRouter();
    const { data: session } = useSession({ required: true });
    const { cartItems, updateCartItems } = useContext(CartItemsContext);
    const [formValues, setFormValues] = useState<FormValues>({
      address: '',
      cardHolder: '',
      cardNumber: '',
    });

    var precioTotal = 0;  
    cartItems.map((cartItem:any)=>{
      precioTotal = precioTotal + cartItem.product.price * cartItem.qty;
    });

      const onPurchaseBtnClick = async function (event: React.MouseEvent) {
        event.preventDefault();
    
        try {
          const response = await fetch(`/api/users/${session!.user._id}/orders`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formValues),
          });
    
          if (response.ok) {
            router.push('/profile');
            router.refresh();
          } 
        } catch (error) {
          console.log(error);
        }
      };

    return (    
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
                      {cartItems.map((cartItem: any) => (
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
                              {(cartItem.product.price *
                                cartItem.qty).toFixed(2) +
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
                        <td className='px-4 py-3'> {precioTotal.toFixed(2) + ' €'} </td>
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
                <input type='text' name='address' id='address' className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  value = {formValues.address}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormValues((prevFormValues) => ({
                      ...prevFormValues,
                      address: e.target.value,
                    }))
                  }/>
              </div>
              </div>

              <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
              <div className='sm:col-span-3'>
                <label className='block text-sm font-medium leading-6 text-gray-900'>
                  Card Holder
                </label>
                <input type='text' name='cardHolder' id='cardHolder' className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                value = {formValues.cardHolder} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormValues((prevFormValues) => ({
                    ...prevFormValues,
                    cardHolder: e.target.value,
                  }))
                }/>
              </div>

              <div className='sm:col-span-3'>
                <label className='block text-sm font-medium leading-6 text-gray-900'>
                  Card Number
                </label>
                <input type='text' name='cardNumber' id='cardNumber' className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  value = {formValues.cardNumber} 
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormValues((prevFormValues) => ({
                    ...prevFormValues,
                    cardNumber: e.target.value,
                  }))
                }/>
              </div>
            </div>
            <div className='my-8 text-center'>
            <button onClick={onPurchaseBtnClick} className='rounded-full bg-gray-900 px-4 py-2 font-bold text-white hover:bg-gray-700'>
              Purchase
            </button>
          </div>
            </div>
          </section>
        </>
        )
}