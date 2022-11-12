import axios from 'axios';
import { paramsSerializer } from '@frontend/util';

export interface IStructureUpdate {
  Title?: string;
  Variant?: string;
  NewOrder?: number[];
  OldOrder?: number[];
}

export interface IFrameUpdate {
  Order?: number[];
  FrameTags?: string[];
  Motifs?: string[];
  Topics?: string[];
}

export async function updateStructureRequest(
  id: string,
  update: IStructureUpdate,
  accessToken: string
) {
  return axios.patch(`${process.env['NEXT_PUBLIC_API_URL']}BookUnit`, update, {
    params: {
      Id: id,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export async function updateFrameRequest(
  params: any,
  update: IFrameUpdate,
  accessToken: string
) {
  return axios.patch(
    `${process.env['NEXT_PUBLIC_API_URL']}BookUnit/Frame`,
    update,
    {
      params,
      paramsSerializer,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
