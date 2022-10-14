import { createAsyncThunk, Update } from '@reduxjs/toolkit';
import { IBookUnit } from '@frontend/domain';
import { ThunkApi } from '@frontend/shared-ui';
import { patchBookUnit } from './requests/put-book-unit';

export const updateBookUnit = createAsyncThunk<
  Update<IBookUnit & { ManuscriptInfo: string | null }>,
  {
    oldValue: Partial<IBookUnit>;
    newValue: Partial<IBookUnit>;
    orderShift: number | null;
  },
  ThunkApi
>(
  'bookUnits/updateUnit',
  async ({ oldValue, newValue, orderShift }, { getState }) => {
    const state = getState();
    if (orderShift !== null) {
      // todo, different update procedures if the number is int ot float
      // const unitsToUpdate = Object.values(state.bookUnits.entities).filter(
      //   (bu) => bu && bu.OrderInChapter === orderShift
      // );
      // const updates = unitsToUpdate.map(
      //   (bu) => bu && { Title: bu.Title, Order: oldValue.OrderInChapter }
      // );
    }

    const { Id, ...changes } = newValue;
    // await patchBookUnit(
    //   Id as string,
    //   {
    //     Title: newValue.Title !== oldValue.Title ? newValue.Title : undefined,
    //     OrderInChapter:
    //       newValue.OrderInChapter !== oldValue.OrderInChapter
    //         ? newValue.OrderInChapter
    //         : undefined,
    //     Chapter: oldValue.Chapter,
    //   },
    //   state.session.session?.AccessToken
    // );
    return {
      id: Id,
      changes: changes,
    } as Update<IBookUnit & { ManuscriptInfo: string | null }>;
  }
);
