import NextAuth from 'next-auth';
import KeycloakProvider from 'next-auth/providers/keycloak';
import axios from 'axios';

async function refreshAccessToken(token: any) {
  try {
    const params = new URLSearchParams({
      client_id: process.env['KEYCLOAK_ID'],
      client_secret: process.env['KEYCLOAK_SECRET'],
      grant_type: 'refresh_token',
      refresh_token: token.refresh,
      scope: 'openid email profile kalila_api',
    });
    const { data: response, status } = await axios.post(
      process.env['KEYCLOAK_TOKEN'],
      params.toString()
    );

    const refreshedTokens = response;

    if (status !== 200) {
      throw refreshedTokens;
    }

    return {
      ...token,
      access: refreshedTokens.access_token,
      refresh: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    console.log(error);

    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

export default NextAuth({
  secret:
    '1boLZnxSEGxSHQCjB50PiZFyJrKdj2bWIae1qNPXiEaSqG3+xQqch9sb+ITwTRJNOa+LpsxVoZBljBl71kkTE80aiGQMNQV+J5kLxaQIDsJMmAYRRPhupcbb6wNrW+nk1dGDkr0Tn5nl+HitvTnaPkK+/sXj8K0YpVDD6QvNE1BrNJsHx14re9u5EkJTHOd5cAvSdEY3Ili1uU2UbVBtsYc3UWcbrT9qZhoGdw==',
  callbacks: {
    jwt: async ({ token, user, account }) => {
      if (account && user) {
        return {
          access: account.access_token,
          refresh: account.refresh_token,
          user,
        };
      }

      return refreshAccessToken(token);
    },
    session: async ({ session, token }) => {
      return {
        ...session,
        user: token.user,
        access: token.access,
        error: token.error,
      };
    },
  },
  providers: [
    KeycloakProvider({
      clientId: process.env['KEYCLOAK_ID'] ?? ' kalila_web',
      clientSecret:
        process.env['KEYCLOAK_SECRET'] ?? 'AFRO8qj3n32gGSdpBWHDxlfIb7wc65Xi',
      issuer:
        process.env['KEYCLOAK_ISSUER'] ?? 'https://id.kozae.de/realms/Kalila',
      authorization: {
        params: {
          scope: 'openid email profile kalila_api',
          grant_type: 'authorization_code',
        },
      },
      profile(profile) {
        return {
          id: profile.sub,
          username: profile.preferred_username,
          name: profile.name,
          email: profile.email,
          picture: profile.picture,
          roles: profile?.realm_access?.roles ?? [],
        };
      },
    }),
  ],
});
