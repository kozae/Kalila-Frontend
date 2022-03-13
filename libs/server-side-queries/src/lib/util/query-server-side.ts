import { MongoClient } from 'mongodb';
import { clientPromise } from '@frontend/server-side-queries';

export type QueryDefinitions = {
  [name: string]: (client: MongoClient) => Promise<any>;
};

export async function queryServerSide(queries: QueryDefinitions) {
  const client = await clientPromise;
  const result: { [name: string]: any } = {};
  for (const [item, handler] of Object.entries(queries)) {
    result[item] = await handler(client);
  }
  return result;
}
