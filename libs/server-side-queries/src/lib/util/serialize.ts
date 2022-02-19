import { ObjectId } from 'mongodb';

export interface IDocumentWithObjectId {
  _id: ObjectId;
}
export function serialize(docs: IDocumentWithObjectId[]) {
  return docs.map((doc) => {
    const { _id, ...content } = doc;
    return {
      ...content,
      id: _id.toHexString(),
    };
  });
}

export interface IDocumentWithObjectIdAndMSId {
  _id: ObjectId;
  ManuscriptId: ObjectId;
}
export function serializePageTranscription(
  docs: IDocumentWithObjectIdAndMSId[]
) {
  return docs.map((doc) => {
    const { _id, ManuscriptId, ...content } = doc;
    return {
      ...content,
      id: _id.toHexString(),
      ManuscriptId: ManuscriptId.toHexString(),
      Version: null,
      CreatedAt: null,
    };
  });
}
