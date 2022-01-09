import NextAuth from "next-auth"
import KeycloakProvider from "next-auth/providers/keycloak";


export default NextAuth({
  secret: "revjZSuOKv8Q5Q1xRTZM4etElUcNVlXpgBwzUkT6tJE=",
  callbacks: {
    jwt: async ({token, user}) => {
      user && (token.user = user)
      return token
    },
    session: async ({session, token}) => {
      session.user = token.user
      return session
    }
  },
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_ID,
      clientSecret: process.env.KEYCLOAK_SECRET,
      issuer: process.env.KEYCLOAK_ISSUER,
      authorization: {params: {scope: "openid email profile kalila_api roles"}},
      profile(profile, tokens) {
        return {
          id: profile.sub,
          username: profile.preferred_username,
          name: profile.name,
          email: profile.email,
          roles: profile.groups.join(', '),
          token: tokens.access_token,
        }
      },
    })
  ],
})
