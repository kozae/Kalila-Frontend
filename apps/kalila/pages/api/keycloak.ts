import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import qs from 'qs';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const accessTokenRequest = {
    username: process.env['KEYCLOAK_ADMIN'],
    password: process.env['KEYCLOAK_ADMIN_PASS'],
    client_id: 'admin-cli',
    grant_type: 'password',
    scope: 'openid',
    realm: 'master',
  };
  try {
    const { data: accessTokenResponse } = await axios.post(
      process.env['KEYCLOAK_ADMIN_TOKEN'],
      qs.stringify(accessTokenRequest),
      {
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
      }
    );
    const { access_token } = accessTokenResponse;

    const { data } = await axios.get(process.env['KEYCLOAK_ADMIN_USERS'], {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    res.status(200).json(data);
  } catch (e) {
    console.log(e);
    res.status(503).json({ error: 'cannot retrieve users' });
  }
};
