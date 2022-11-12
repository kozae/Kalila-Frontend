import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import qs from 'qs';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const accessTokenRequest = {
    username: 'greenman',
    password: 'c659B87$-2a9d-41e7-@1F4-b8c*98359dac',
    client_id: 'admin-cli',
    grant_type: 'password',
  };
  try {
    const { data: accessTokenResponse } = await axios.post(
      'https://id.kozae.de/realms/master/protocol/openid-connect/token',
      qs.stringify(accessTokenRequest),
      {
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
      }
    );
    const { access_token } = accessTokenResponse;

    const { data } = await axios.get(
      'https://id.kozae.de/admin/realms/Kalila/users',
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    res.status(200).json(data);
  } catch (e) {
    res.status(503).json({ error: 'cannot retrieve users' });
  }
};
