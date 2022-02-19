import { MongoClient, ObjectId } from 'mongodb';
import { serialize } from '../util/serialize';

export function pages(manuscriptId: string) {
  return async (client: MongoClient) => {
    const pages = await client
      .db('KalilaDB')
      .collection(`Pages_${manuscriptId}`)
      .find({})
      .sort({ Number: 1 })
      .project<{ _id: ObjectId; Number: number }>({ _id: 1, Number: 1 })
      .toArray();

    return serialize(pages) as { id: string; Number: string }[];
  };
}
