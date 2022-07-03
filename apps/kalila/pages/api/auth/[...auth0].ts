import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';

export default handleAuth({
  async login(req, res) {
    try {
      await handleLogin(req, res, {
        authorizationParams: {
          audience: 'https://kalila-api.kozae.de/',
          scope: 'openid profile',
          grant_type: 'client_credentials',
        },
      });
    } catch (error) {
      res.status(error.status || 400).end(error.message);
    }
  },
});
