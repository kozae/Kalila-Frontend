import {
  IBookUnit,
  IChapter,
  IFrameUpdate,
  IStructureUpdate,
  IUnitSummary,
} from '@frontend/domain';
import useSWRImmutable from 'swr/immutable';

import {
  MediaTypes,
  getPagination,
  paramsSerializer,
  stringHasValue,
} from '@frontend/util';
import {
  discardThunk,
  fetcher,
  loadBookUnits,
  removeLacuna,
  repopulateUnitSummariesBeforeChanges,
  saveThunk,
  selectAllUnitSummaries,
  selectNearestOpenUnit,
  updateManyUnits,
  updateNearestOpenUnit,
  useAppDispatch,
  useAppSelector,
  ApiClient,
} from '@frontend/shared-ui';
import { useCallback, useEffect } from 'react';
import { addListener, Update } from '@reduxjs/toolkit';
import ObjectID from 'bson-objectid';

export function useBookUnits(chapter: IChapter | null, manuscriptId: string) {
  const filter =
    chapter && chapter.abbr === 'untagged'
      ? { FrameTagsEmpty: true }
      : chapter && chapter.abbr === 'all'
      ? {}
      : { FrameTagsCn: chapter?.abbr };
  return useSWRImmutable(
    chapter
      ? [
          'BookUnit',
          {
            ...filter,
            PageSize: '-1',
            ManuscriptInfo: manuscriptId,
          },
          MediaTypes.FullDescriptionDocument,
          {},
        ]
      : null,
    fetcher
  );
}

export function useBookUnitsStore(data?: { content: any }) {
  const dispatch = useAppDispatch();
  const unitsOnPage = useAppSelector(selectAllUnitSummaries);
  const openUnit = useAppSelector(selectNearestOpenUnit);
  useEffect(() => {
    if (data) {
      dispatch(loadBookUnits(data.content));
      const unitSummaryUpdates: Update<IUnitSummary>[] = [];
      unitsOnPage.forEach((unit) => {
        const bu = data.content.find(
          (u: IBookUnit) => u.Id === unit.BookUnitId
        );
        if (bu !== undefined) {
          unitSummaryUpdates.push({
            id: unit.Id,
            changes: {
              Order: bu.Order,
              BookUnit: bu.Title,
              FrameTags: bu.FrameTags,
            },
          });
        }
      });
      dispatch(updateManyUnits(unitSummaryUpdates));
      if (openUnit) {
        const bu = data.content.find(
          (u: IBookUnit) => u.Id === openUnit.BookUnitId
        );
        dispatch(
          updateNearestOpenUnit({
            ...openUnit,
            Order: bu.Order,
            BookUnit: bu.Title,
            FrameTags: bu.FrameTags,
          })
        );
      }
      dispatch(repopulateUnitSummariesBeforeChanges({}));
    }
  }, [data]);
}

export function useRefetchOnSegmentationChange(refetchUnits: () => any) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const unsubscribe = dispatch(
      addListener({
        predicate: (action) =>
          [
            discardThunk.segmentationChanges + '/fulfilled',
            saveThunk.segmentationChanges + '/fulfilled',
          ].includes(action.type),
        effect: async (action, store) => {
          if (refetchUnits) {
            const data = await refetchUnits();
            if (data) {
              store.dispatch(loadBookUnits(data.content));
            }
          }
        },
      })
    );

    return () => {
      unsubscribe();
    };
  }, []);
}

export function useCRUDHandlers(refetchUnits: () => any) {
  const dispatch = useAppDispatch();
  const onDeleteLacunae = (id: string, msUnitId: string) => {
    dispatch(removeLacuna({ id, lacuna: msUnitId }));
  };

  const onDeleteDivider = useCallback(
    async (id: string) => {
      await deleteBookUnit(id as string);
      if (refetchUnits) {
        await refetchUnits();
      }
    },
    [refetchUnits]
  );

  const onDeleteBookUnit = useCallback(
    async (id: string) => {
      await deleteBookUnit(id as string);
      if (refetchUnits) {
        await refetchUnits();
      }
    },
    [refetchUnits]
  );

  const create = useCallback(
    async (value: Partial<IBookUnit>) => {
      try {
        await createRequest({
          Id: ObjectID().toString(),
          Title: value.Title,
          Order: value.Order,
          Variant: stringHasValue(value.Variant) ? value.Variant : undefined,
          Divider: value.Divider,
          FrameTags: value.FrameTags,
          Editor: 'mk',
          EditionProgress: 'in work',
        });
        await refetchUnits();
      } catch (err) {
        console.log(err);
      }
    },
    [refetchUnits]
  );

  const updateBookUnit = useCallback(
    async (
      params: any,
      updateStructure?: IStructureUpdate,
      updateFrame?: IFrameUpdate
    ) => {
      if (updateStructure) {
        const id = params?.Ids[0];
        id && (await updateStructureRequest(id, updateStructure));
      }

      if (updateFrame) {
        await updateFrameRequest(params, updateFrame);
      }
      await refetchUnits();
    },
    [refetchUnits]
  );

  const count = useCallback(countBookUnits, []);
  const validate = useCallback(validateRequest, []);

  return {
    onDeleteLacunae,
    onDeleteDivider,
    onDeleteBookUnit,
    create,
    updateBookUnit,
    count,
    validate,
  };
}

async function deleteBookUnit(id: string) {
  await ApiClient().delete(`${process.env['NEXT_PUBLIC_API_URL']}BookUnit`, {
    params: {
      Id: id,
    },
    headers: {},
  });
}

export const validateRequest = (params: any) => {
  return ApiClient()
    .get<boolean>(`${process.env['NEXT_PUBLIC_API_URL']}BookUnit/Check`, {
      params,
      paramsSerializer,
    })
    .then((r) => !r.data);
};

export const countBookUnits = (params: any) => {
  return ApiClient()
    .get<number>(`${process.env['NEXT_PUBLIC_API_URL']}BookUnit`, {
      params: {
        ...params,
        PageSize: 1,
        PageNumber: 1,
      },
      paramsSerializer,
      headers: {},
    })
    .then((r) => getPagination(r.headers)?.totalItems);
};

export async function createRequest(unit: Partial<IBookUnit>) {
  return ApiClient().post(
    `${process.env['NEXT_PUBLIC_API_URL']}BookUnit`,
    unit,
    {
      headers: {},
    }
  );
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
      paramsSerializer,
      headers: {},
    }
  );
}
