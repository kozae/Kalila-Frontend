import { MongoClient, ObjectId } from 'mongodb';
import { serialize } from '../util/serialize';

export async function sigla(client: MongoClient) {
  const sigla = await client
    .db('KalilaDB')
    .collection('ManuscriptDescriptionDocuments')
    .find({})
    .sort({ Siglum: 1 })
    .project<{ _id: ObjectId; Siglum: string }>({ _id: 1, Siglum: 1 })
    .toArray();
  return serialize(sigla) as { Id: string; Siglum: string }[];
}
