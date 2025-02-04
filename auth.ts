import Credentials from "next-auth/providers/credentials";
import NextAuth, { User as NextAuthUser } from "next-auth";
import { z } from "zod";
import { drizzle } from "drizzle-orm/vercel-postgres";
import * as schema from "@/app/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

type User = NextAuthUser & {
  firstName: string;
  lastName: string;
}
const db = drizzle({ schema });

async function getUser(email: string) {
  try {
    return await db.query.users.findFirst({
      where: eq(schema.users.email, email),
    });
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsedCredentials.success) return null;

        const { email, password } = parsedCredentials.data;
        const user = await getUser(email);
        if (!user) return null;

        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (!passwordsMatch) return null;

        // Return only the needed fields
        return {
          id: user.id.toString(),
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email, // Optional
        };
      },
    }),
  ],
  callbacks: {
    // Attach user data to JWT
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.firstName = (user as User).firstName;
        token.lastName = (user as User).lastName;
      }
      return token;
    },
    // Expose user data to session
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.firstName as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt", // Store session data in JWT instead of database
  },
});
