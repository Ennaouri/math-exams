import NextAuth from 'next-auth';
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

export const { handlers, auth, signIn, signOut } = NextAuth({
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
          const user = await authenticateUser(credentials.email as string, credentials.password as string);
          if (!user) {
            return null;
          }
          if ((user as any).needsVerification) {
            throw new Error('Email not verified');
          }
          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error: any) {
          console.error('Auth error:', error);
          if (error.message === 'Email not verified') {
            throw error;
          }
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
            const userMeta = JSON.stringify({ role: 'user', emailVerified: true });
            dbUser = await createUser(email, '', profile.name || 'Google User', 'user', userMeta);
          } else if (dbUser.metadata) {
            const meta = JSON.parse(dbUser.metadata);
            if (meta.emailVerified === false) {
              meta.emailVerified = true;
              delete meta.verifyToken;
              delete meta.verifyExpires;
              const { updateUser } = await import('./db');
              await updateUser(dbUser.id, { metadata: JSON.stringify(meta) });
            }
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
});