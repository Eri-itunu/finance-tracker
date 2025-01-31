import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');

      if (isOnDashboard && !isLoggedIn) {
        return Response.redirect(new URL('/login', nextUrl)); // Redirect unauthenticated users
      } else if (isLoggedIn && nextUrl.pathname === '/login') {
        return Response.redirect(new URL('/dashboard', nextUrl)); // Redirect logged-in users
      }

      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;



