import { IBookUnit } from '@frontend/domain';
import { ApiClient } from '@frontend/shared-ui';

export async function createRequest(unit: Partial<IBookUnit>) {
  return ApiClient().post(
    `${process.env['NEXT_PUBLIC_API_URL']}BookUnit`,
    unit,
    {
      headers: {},
    }
  );
}
