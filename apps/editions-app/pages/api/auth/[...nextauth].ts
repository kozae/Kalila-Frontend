import NextAuth from 'next-auth';
import KeycloakProvider from 'next-auth/providers/keycloak';

export default NextAuth({
  secret: 'c659B87$-2a9d-41e7-@1F4-b8c*98359dac',
  providers: [
    KeycloakProvider({
      clientId: 'kalila_web_editions',
      clientSecret: 'lI7N14p4ziXic9c1s0mzidh0ImtCAZZo',
      issuer: 'https://id.kozae.de/realms/Kalila',
      authorization: {
        params: {
          scope: 'openid email profile',
        },
      },
    }),
  ],
});
