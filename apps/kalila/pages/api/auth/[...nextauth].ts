import NextAuth from 'next-auth';
import KeycloakProvider from 'next-auth/providers/keycloak';

export default NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    jwt: async ({ token, user, account }) => {
      if (user && account) {
        token.user = user;
        token.access = account.access_token;
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.user = token.user;
      session.access = token.access;
      return session;
    },
  },
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_ID,
      clientSecret: process.env.KEYCLOAK_SECRET,
      issuer: process.env.KEYCLOAK_ISSUER,
      profile(profile) {
        return {
          id: profile.sub,
          username: profile.preferred_username,
          name: profile.name,
          email: profile.email,
          roles: profile.groups.join(', '),
        };
      },
    }),
  ],
});
