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
        const email = credentials.email as string;
        const password = credentials.password as string;
        try {
          const user = await authenticateUser(email, password);
          if (!user) {
            return null;
          }
          console.log('authorize returning user:', { id: user.id, email: user.email, name: user.name, role: user.role, image: user.image });
          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.image,
          };
        } catch (error: any) {
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
            const userMeta = JSON.stringify({ role: 'user', emailVerified: true });
            dbUser = await createUser(email, '', profile.name || 'Google User', 'user', userMeta);
          } else if (dbUser.metadata) {
            try {
              const meta = JSON.parse(dbUser.metadata);
              if (meta.emailVerified === false) {
                meta.emailVerified = true;
                delete meta.verifyToken;
                delete meta.verifyExpires;
                const { updateUser } = await import('./db');
                await updateUser(dbUser.id, { metadata: JSON.stringify(meta) });
              }
              // Extract image from metadata if exists
              if (meta.image) {
                token.image = meta.image;
              }
            } catch (e) {}
          }
          token.id = dbUser.id;
          token.role = dbUser.role;
          // Also check direct image field
          if (dbUser.image) {
            token.image = dbUser.image;
          }
        }
      }
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role || 'user';
        token.image = (user as any).image;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role || 'user';
        (session.user as any).image = token.image;
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