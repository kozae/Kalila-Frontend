import { ObjectId } from 'mongodb';

export interface IDocumentWithObjectId {
  _id: ObjectId;
}

export function serialize(docs: IDocumentWithObjectId[]) {
  return docs.map((doc) => {
    const { _id, ...content } = doc;
    return {
      ...content,
      Id: _id.toHexString(),
    };
  });
}
