import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@auth0/nextjs-auth0';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = getSession(req, res);
  res.status(200).json(session);
};
