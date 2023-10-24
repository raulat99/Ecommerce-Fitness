import { NextAuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import connect from '@/lib/mongoose';
import Users from '@/models/User';
import bcrypt from 'bcrypt';


export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'E-mail address',
          type: 'email',
          placeholder: 'jsmith@jsmith.com',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      async authorize(credentials, req) {
        await connect();

        if(!credentials?.email || !credentials?.password){
            console.log("El email o password no existen");
            return null;
        }
        
        const user = await Users.findOne({email: credentials.email})
        
        if(user === null){
          console.log("El user es nulo");
            return null;
        }

        const match = await bcrypt.compare(credentials.password, user.password);

        if(!match){
          console.log("Las contraseñas no coinciden");
          return null;
        }

        console.log("User id: " + user._id.toString());

        return { _id: user._id.toString() } as User;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user._id = token._id;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id;
      }
      return token;
    },
  },
};
