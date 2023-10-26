import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Users, { User } from '@/models/User';
import Products, { Product } from '@/models/Product';
import Orders, { Order } from '@/models/Order';
import bcrypt from 'bcrypt';

dotenv.config({ path: `.env.local`, override: true });
const MONGODB_URI = process.env.MONGODB_URI;

const products: Product[] = [
    {
      name: 'Black and Red Straps',
      price: 39.95,
      img: 'https://cdn.shopify.com/s/files/1/0525/5872/5271/products/ADRISUNNER-7842.jpg?v=1653643246&width=2240',
      description: 'Enhance your training!',
    },
    {
      name: 'Dumbell',
      price: 19.95,
      img: 'https://krag.es/wp-content/uploads/2021/11/dumbell-600x600.jpeg',
      description: '22.5 KG for a true weigthlifter',
    },
    {
      name: 'Training Sleeveless Shirt',
      price: 14.95,
      img: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQfY0hAJxDfT9nvzLHm7rlUwYbl-9OxBeWsidMx5mL2NGAR11hN386A-ixxrnUsw4Rll47fs5FhYvWogHM4r06wH6pAuZ-pEcMzwSxe0uf4iHXzjNO7Pfxp&usqp=CAc',
      description: 'Turtleneck Black Sleeveless Shirt. Only for gymrats!',
    },
    {
      name: "Training Shorts",
      price: 9.95,
      img: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSBEymZXIpC_III9EnMIsZllGfUr_CxZTPf1YtLlLry5YrEuiJPTShVldCRRDOhqs_ve44_o2jeJ3iDAeCoc1bi_0sAk0qruzxAPqjIaOXzf1OnAgk_cSvmIg&usqp=CAc',
      description: 'Best shorts in the market!',
    }
  ];

  

  const orderProjection = {
    address: true ,
    cardHolder: true,
    cardNumber: true,
    date: true,
    orderItems: true,
  }

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


  const insertedProducts = await Products.insertMany(products);

  const orders: Order[] = [
    {
      address: " Unnamed Street 123 , 12345 London , UK" ,
      cardHolder: " Foo Bar " ,
      cardNumber: "0000111122223333",
      date: new Date('1970-01-01'),
      orderItems:[
        {
          product: insertedProducts[0]._id,
          qty: 5,
          price: 40,
        },
        {
          product: insertedProducts[1]._id,
          qty: 5,
          price: 40,
        },
      ]
    },
    {
      address: " Another address 456 , 45678 London , UK" ,
      cardHolder: " Foo Bar " ,
      cardNumber: "4455667788990011",
      date: new Date('1970-01-01'),
      orderItems:[]
    },
  ];

  const hash = await bcrypt.hash('1234', 10);


  const insertedOrders = await Orders.insertMany(orders);
    const user: User = {
      email: 'johndoe@example.com',
      password: hash,
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
      orders: [insertedOrders[0]._id, insertedOrders[1]._id],
    };
    const res = await Users.create(user);
    console.log(JSON.stringify(res, null, 2));
  
    const user1: User = {
      email: 'pepe@example.com',
      password: hash,
      name: 'Pepe',
      surname: 'Gonzalez',
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
      orders: [insertedOrders[0]._id, insertedOrders[1]._id],
    };
    const res1 = await Users.create(user1);
    console.log(JSON.stringify(res1, null, 2));

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

    const ordersSelect = await Orders.findOne({
      cardHolder:" Foo Bar ",
      date: "1970-01-01T00:00:00.000Z",
      cardNumber: "4455667788990011",
      orderItems: []
    });
    console.log(JSON.stringify(ordersSelect, null, 2))
    
  await conn.disconnect();
}

seed().catch(console.error);