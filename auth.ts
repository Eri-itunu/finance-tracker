import NextAuth, { User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import { drizzle } from "drizzle-orm/vercel-postgres";
import * as schema from "@/app/db/schema";
import { eq } from "drizzle-orm";
const db = drizzle({ schema });
import bcrypt from 'bcrypt';
 
async function getUser(email: string) {
  try {
    const userValue = await db.query.users.findFirst({   
        where: eq(schema.users.email, email),
    });
    // console.log(userValue);
    return userValue;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}
 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
 
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          console.log(user)
          if (!user) return null;
          const passwordsMatch = await bcrypt.compare(password, user.password);

          if(passwordsMatch) {
            const userWithStringId: User = { ...user, id: user.id.toString() };
            return userWithStringId;
          }
        }
        
        console.log("invalid credentials")
        return null;
      },
    }),
  ],
});