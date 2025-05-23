import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';
export const API_HOST_BASE_URL = process.env.NEXT_PUBLIC_API_HOST_BASE_URL!;
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

declare module 'next-auth' {
  interface User {
    id?: string;
    accessToken?: string;
    refreshToken?: string;
    expiresIn?: number;
  }

  interface Session {
    accessToken?: string;
    refreshToken?: string;
    error?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    error?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.username || !credentials?.password) {
            throw new Error("Missing username or password");
          }

          const data = new URLSearchParams();
          data.append("username", credentials.username);
          data.append("password", credentials.password);

          const response = await axios.post(`${API_HOST_BASE_URL}auth/token`, data, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          });

          const { access_token, refresh_token, expires_in } = response.data;

          if (access_token && refresh_token) {
            return {
              id: access_token,
              accessToken: access_token,
              refreshToken: refresh_token,
              expiresIn: expires_in,
            };
          }

          return null;
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
    async signIn({ user, account }) {
      if (account?.provider === 'google' || account?.provider === 'github') {
        try {
          const res = await axios.post(`${API_HOST_BASE_URL}auth/oauth-register`, {
            email: user.email,
            username: user.name ?? user.email?.split("@")[0],
            provider: account.provider,
            access_token: account.access_token,
          });

          if (
            res.data?.msg === "User already exists" ||
            res.data?.msg === "OAuth user created"
          ) {
            return true;
          }

          return false;
        } catch (err) {
            const error = err as import("axios").AxiosError;
          
            const data = error.response?.data as { msg?: string };
          
            if (data?.msg === "User already exists") {
              return true;
            }
          
            console.error("OAuth user registration failed:", {
              message: error.message,
              status: error.response?.status,
              data: error.response?.data,
            });  
            return false;
          }          
      }
      return true;
    },

    async jwt({ token, user, account }) {
      if (user && account?.type === "credentials") {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.expiresAt = Date.now() + (user.expiresIn ?? 0) * 1000;
      }

      if (account?.type !== "credentials") {
        return token;
      }

      if (token.expiresAt && Date.now() < token.expiresAt) {
        return token;
      }

      try {
        const response = await axios.post(`${API_HOST_BASE_URL}auth/refresh`, {
          refresh_token: token.refreshToken,
        });

        const { access_token, expires_in } = response.data;

        return {
          ...token,
          accessToken: access_token,
          expiresAt: Date.now() + (expires_in ?? 0) * 1000,
        };
      } catch (error) {
        console.error('Token refresh error:', error);
        return { ...token, error: 'RefreshAccessTokenError' };
      }
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.error = token.error;
      return session;
    },
  },
  events: {
    async signOut({ token }) {
      try {
        if (token?.refreshToken) {
          await axios.post(`${API_HOST_BASE_URL}auth/logout`, {
            refresh_token: token.refreshToken,
          });
          console.log('Tokens revoked successfully');
        }
      } catch (error) {
        console.error('Token revocation failed:', error);
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
};

export default NextAuth(authOptions);
