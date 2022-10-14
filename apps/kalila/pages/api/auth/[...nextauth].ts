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
      'https://id.kozae.de/realms/Kalila/protocol/openid-connect/token',
      params.toString()
    );

    const refreshedTokens = response;

    if (status !== 200) {
      throw refreshedTokens;
    }

    return {
      ...token,
      access: refreshedTokens.access_token,
      accessExpires: Date.now() + refreshedTokens.expires_at * 1000,
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
  secret: 'c659B87$-2a9d-41e7-@1F4-b8c*98359DaG',
  callbacks: {
    jwt: async ({ token, user, account }) => {
      if (account && user) {
        return {
          access: account.access_token,
          accessExpires: Date.now() + account.expires_at * 1000,
          refresh: account.refresh_token,
          user,
        };
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < token.accessExpires) {
        return { ...token };
      }

      console.log('refreshing token...');

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
