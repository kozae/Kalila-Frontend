import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
//@ts-ignore
import multer from 'multer';
export type SuccessfulResponse<T> = {
  data: T;
  error?: never;
  statusCode?: number;
};
export type UnsuccessfulResponse<E> = {
  data?: never;
  error: E;
  statusCode?: number;
};
export type ApiResponse<T, E = unknown> =
  | SuccessfulResponse<T>
  | UnsuccessfulResponse<E>;

interface NextConnectApiRequest extends NextApiRequest {
  files: Express.Multer.File[];
}
type ResponseData = ApiResponse<string[], string>;

const oneMegabyteInBytes = 1000000;
const outputFolderName = '/images/files/anonymclassic/folio_description/';

export const createUpdateHandler = (fileNameFactory: () => string) => {
  const upload = multer({
    limits: { fileSize: oneMegabyteInBytes * 2 },
    storage: multer.diskStorage({
      destination: outputFolderName,
      filename: (req, file, cb) => cb(null, fileNameFactory()),
    }),
    fileFilter: (req, file, cb) => {
      const acceptFile: boolean = ['image/jpeg'].includes(file.mimetype);
      cb(null, acceptFile);
    },
  });

  const apiRoute = nextConnect({
    onError(
      error,
      req: NextConnectApiRequest,
      res: NextApiResponse<ResponseData>
    ) {
      res
        .status(501)
        .json({ error: `Sorry something Happened! ${error.message}` });
    },
    onNoMatch(req: NextConnectApiRequest, res: NextApiResponse<ResponseData>) {
      res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
  });

  apiRoute.post(upload.array('theFiles'), (req, res: NextApiResponse<any>) => {
    res.status(200).json({ data: req.files[0].path.replace('/images', '') });
  });

  return apiRoute;
};
