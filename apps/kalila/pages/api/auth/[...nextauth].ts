import NextAuth from "next-auth"
import KeycloakProvider from "next-auth/providers/keycloak";


export default NextAuth({
  providers: [
    KeycloakProvider({
      clientId: "kalila_web",
      clientSecret: "718488e7-33d9-487d-8a14-f140e6cfe54a",
      issuer: "https://idp.kozae.de/auth/realms/Kalila",
      authorization: { params: { scope: "openid email profile kalila_api" } },
    })
  ],
})
