import { MongoClient } from 'mongodb';
import { pageTranscriptionPipeline } from '../pipelines/page-transcription';

export function pageTranscription(manuscriptId: string, pageId: string) {
  return async (client: MongoClient) => {
    return (
      await client
        .db('KalilaDB')
        .collection(`Pages_${manuscriptId}`)
        .aggregate(pageTranscriptionPipeline(manuscriptId, pageId))
        .toArray()
    )[0];
  };
}
