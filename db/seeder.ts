import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Users, { User } from '@/models/User';
import Products, { Product } from '@/models/Product';
import Orders, { Order } from '@/models/Order';

dotenv.config({ path: `.env.local`, override: true });
const MONGODB_URI = process.env.MONGODB_URI;

const products: Product[] = [
    {
      name: 'Earthen Bottle',
      price: 39.95,
      img: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-01.jpg',
      description: 'What a bottle!',
    },
    {
      name: 'Nomad Tumbler',
      price: 39.95,
      img: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-02.jpg',
      description: 'Yet another item',
    },
  ];


  const userProjection = {
    name: true,
    surname: true,
  };
  const productProjection = {
    name: true,
    price: true,
  };

async function seed() {
  if (!MONGODB_URI) {
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env.local'
    );
  }

  const opts = {
    bufferCommands: false,
  };
  const conn = await mongoose.connect(MONGODB_URI, opts);

  await conn.connection.db.dropDatabase();
  //// Do things here.

  //COMENTARIO: ESTO ES PARA CREAR UN USUARIO
  //const user: User = {
  //  email: 'johndoe@example.com',
  //  password: '1234',
  //  name: 'John',
  //  surname: 'Doe',
  //  address: '123 Main St, 12345 New York, United States',
  //  birthdate: new Date('1970-01-01'),
  //};
  //const res = await Users.create(user);
  //console.log(JSON.stringify(res, null, 2));

  //COMENTARIO: ESTO ES PARA BUSCAR UN USUARIO POR ID
    //const retrievedUsers = await Users.findById("650b2f9fb118c7160297144d");
    //console.log(JSON.stringify(retrievedUsers, null, 2));

  //COMENTARIO: ESTO ES PARA BUSCAR UN USUARIO Y CAMBIARLE EL NOMBRE
    //const retrievedUserByCriteria = await Users.findOne({
    //    email: 'johndoe@example.com',
    //  });
    //  console.log(JSON.stringify(retrievedUserByCriteria, null, 2));
    //  
    //  retrievedUserByCriteria.name = 'Foo';
    //  await retrievedUserByCriteria.save();
    //  
    //  const retrievedNewUserByCriteria = await Users.findOne({
    //    email: 'johndoe@example.com',
    //  });
    //  console.log(JSON.stringify(retrievedNewUserByCriteria, null, 2));

//
    //  const product: Product = {
    //    name: 'CSGO',
    //    description: 'Shooter',
    //    img: '/images/csgo.jpg',
    //    price: 20,
    //  };
    //  const resProduct = await Products.create(product);
    //  console.log(JSON.stringify(resProduct, null, 2));


    /*const retrievedUserSinPopulate = await Users.findOne({ email: 'johndoe@example.com' });
    console.log(JSON.stringify(retrievedUserSinPopulate, null, 2));


    const retrievedUserConPopulate = await Users
        .findOne({ email: 'johndoe@example.com' })
        .populate('cartItems.product');
    console.log(JSON.stringify(retrievedUserConPopulate, null, 2));


    const retrievedUserConSelection = await Users
        .findOne({ email: 'johndoe@example.com' }, userProjection)
        .populate('cartItems.product', productProjection);
    console.log(JSON.stringify(retrievedUserConSelection, null, 2));*/

    const insertedProducts = await Products.insertMany(products);
    const user: User = {
      email: 'johndoe@example.com',
      password: '1234',
      name: 'John',
      surname: 'Doe',
      address: '123 Main St, 12345 New York, United States',
      birthdate: new Date('1970-01-01'),
      cartItems: [
        {
          product: insertedProducts[0]._id,
          qty: 2,
        },
        {
          product: insertedProducts[1]._id,
          qty: 5,
        },
      ],
      orders: [],
    };
    const res = await Users.create(user);
    console.log(JSON.stringify(res, null, 2));
  
    

  await conn.disconnect();
}

seed().catch(console.error);