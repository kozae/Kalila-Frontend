import { MongoClient, ObjectId } from 'mongodb';

export function siglum(id: string) {
  return async (client: MongoClient) => {
    const doc = await client
      .db('KalilaDB')
      .collection('ManuscriptDescriptionDocuments')
      .findOne(
        { _id: new ObjectId(id) },
        { projection: { _id: 0, Siglum: 1 } }
      );

    return doc.Siglum;
  };
}
