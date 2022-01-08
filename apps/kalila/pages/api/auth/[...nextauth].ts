import NextAuth from "next-auth"
import KeycloakProvider from "next-auth/providers/keycloak";


export default NextAuth({
  secret: "revjZSuOKv8Q5Q1xRTZM4etElUcNVlXpgBwzUkT6tJE=",
  debug: true,
  callbacks: {
    jwt: async ({token, user, ...rest}) => {
      user && (token.user = user)
      return token
    },
    session: async ({session, token, ...rest}) => {
      session.user = token.user
      return session
    }
  },
  providers: [
    KeycloakProvider({
      clientId: "kalila_web",
      clientSecret: "718488e7-33d9-487d-8a14-f140e6cfe54a",
      issuer: "https://idp.kozae.de/auth/realms/Kalila",
      authorization: {params: {scope: "openid email profile kalila_api roles"}},
      profile(profile, tokens) {
        console.log({tokens})
        console.log({profile})
        return {
          id: profile.sub,
          name: profile.name ?? profile.preferred_username,
          email: profile.email,
          roles: "roles here",
        }
      },
    })
  ],
})
