import { paramsSerializer } from '@frontend/util';
import { ApiClient } from '@frontend/shared-ui';

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
  update: IStructureUpdate
) {
  return ApiClient().patch(
    `${process.env['NEXT_PUBLIC_API_URL']}BookUnit`,
    update,
    {
      params: {
        Id: id,
      },
      headers: {},
    }
  );
}

export async function updateFrameRequest(params: any, update: IFrameUpdate) {
  return ApiClient().patch(
    `${process.env['NEXT_PUBLIC_API_URL']}BookUnit/Frame`,
    update,
    {
      params,
      paramsSerializer: { serialize: paramsSerializer },
      headers: {},
    }
  );
}
