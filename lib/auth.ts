import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { authenticateUser, createUser, getUserByEmail } from './db';

const getAuthSecret = () => {
  const envSecret = process.env.NEXTAUTH_SECRET;
  if (envSecret && envSecret.length > 10) {
    return envSecret;
  }
  return 'development-secret-do-not-use-in-production-12345678';
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        try {
          const user = await authenticateUser(credentials.email, credentials.password);
          if (!user) {
            return null;
          }
          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (account && profile) {
        const email = profile.email;
        if (email) {
          let dbUser = await getUserByEmail(email);
          if (!dbUser) {
            dbUser = await createUser(email, '', profile.name || 'Google User', 'user');
          }
          token.id = dbUser.id;
          token.role = dbUser.role;
        }
      }
      if (user) {
        token.role = (user as any).role || 'user';
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role || 'user';
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60,
  },
  secret: getAuthSecret(),
};