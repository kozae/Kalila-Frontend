import {ObjectId} from "mongodb";

interface IDocumentWithObjectId {
  _id: ObjectId
}
export function serialize(docs: IDocumentWithObjectId[]) {
  return docs.map( doc=> {
    const {_id, ...content} = doc;
    return {
      ...content,
      id: _id.toHexString()
    }
  })
}
