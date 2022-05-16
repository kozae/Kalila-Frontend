import { createUpdateHandler } from '@frontend/server-side-queries';
import { v4 } from 'uuid';

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
export default createUpdateHandler(() => `${v4()}.jpg`);
