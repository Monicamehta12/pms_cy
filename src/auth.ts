// import NextAuth from 'next-auth';
// import Credentials from 'next-auth/providers/credentials';
// import { authConfig } from './auth.config';
// // import { sql } from '@vercel/postgres';
// import { z } from 'zod';
// import User from '@/app/models/User';
// import bcrypt from 'bcryptjs';
// import { connectDB } from './app/config/connectDB';
 
// connectDB();

// async function getUser(email: string) {
//     try {
//       const user = await User.findOne({ email });
//       return user;
//     } catch (error) {
//       console.error('Failed to fetch user:', error);
//       throw new Error('Failed to fetch user.');
//     }
//   }
 
// export const { auth, signIn, signOut } = NextAuth({
//     ...authConfig,
//     providers: [
//       Credentials({
//         async authorize(credentials) {
//           const parsedCredentials = z
//             .object({ email: z.string().email(), password: z.string().min(6) })
//             .safeParse(credentials);
 
//         if (parsedCredentials.success) {
//           const { email, password } = parsedCredentials.data;
//           const user = await getUser(email);
//           if (!user) return null;
//           const passwordsMatch = await bcrypt.compare(password, user.password);
 
//           if (passwordsMatch) return user;
//         }
 
//         console.log('Invalid credentials');
//         return null;
//       },
//     }),
//   ],
// });