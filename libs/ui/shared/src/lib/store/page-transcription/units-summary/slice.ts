import {
  createEntityAdapter,
  createSlice,
  EntityState,
  PayloadAction,
} from '@reduxjs/toolkit';
import { IBookUnit, IUnitSummary } from '@frontend/domain';
import { closeUnit, moveUnit, removeUnitEndTag } from './thunks';
import {
  discardTokenChanges,
  saveSegmentation,
  discardSegmentationChanges,
} from '../../text-editing-page';
import { replaceLinesTokens } from '../tokens';

export const unitSummariesAdapter = createEntityAdapter<IUnitSummary>({
  selectId: (doc) => doc.Id,
});

const initialState = unitSummariesAdapter.getInitialState();

export const unitSummariesSlice = createSlice({
  name: 'unitSummaries',
  initialState,
  reducers: {
    loadUnitSummaries: unitSummariesAdapter.setAll,
    insertUnit: unitSummariesAdapter.addOne,
    updateUnit: unitSummariesAdapter.updateOne,
    updateManyUnits: unitSummariesAdapter.updateMany,
    removeUnit: (
      state,
      action: PayloadAction<{ msUnitId: string; bookUnitId: string }>
    ) => {
      unitSummariesAdapter.removeOne(state, action.payload.msUnitId);
    },
    replaceUnit: (
      state,
      action: PayloadAction<{ msUnit: IUnitSummary; bookUnit: IBookUnit }>
    ) => {
      unitSummariesAdapter.updateOne(state, {
        id: action.payload.msUnit.Id,
        changes: {
          BookUnitId: action.payload.bookUnit.Id,
          BookUnit: action.payload.bookUnit.Title,
          Order: action.payload.bookUnit.Order,
          FrameTags: action.payload.bookUnit.FrameTags,
        },
      });
    },
    swapUnits: (
      state,
      action: PayloadAction<{ first: IUnitSummary; second: IUnitSummary }>
    ) => {
      unitSummariesAdapter.updateOne(state, {
        id: action.payload.first.Id,
        changes: {
          Start: action.payload.second.Start,
          End: action.payload.second.End,
        },
      });
      unitSummariesAdapter.updateOne(state, {
        id: action.payload.second.Id,
        changes: {
          Start: action.payload.first.Start,
          End: action.payload.first.End,
        },
      });
    },
    clearUnitSummaries: unitSummariesAdapter.removeAll,
  },
  extraReducers: (builder) => {
    builder.addCase(replaceLinesTokens.fulfilled, (state, action) => {
      // remove units whose start token is deleted
      // and nullify the end of units whose end token is deleted
      const idsToRemove: string[] = [];
      for (const { LineOrder, newTokens } of action.payload.data) {
        const unitsStartInLine = Object.values(state.entities).filter(
          (u) => u && u.Start[1] === LineOrder
        ) as IUnitSummary[];
        for (const unit of unitsStartInLine) {
          if (unit.Start[2] > newTokens.length) {
            idsToRemove.push(unit.Id);
          }
        }
        const unitsEndInLine = Object.values(state.entities).filter(
          (u) => u && u.End[1] === LineOrder
        ) as IUnitSummary[];
        for (const unit of unitsEndInLine) {
          if (unit.End[2] > newTokens.length) {
            unitSummariesAdapter.updateOne(state, {
              id: unit.Id,
              changes: {
                End: [-1, -1, -1],
              },
            });
          }
        }
      }
      if (idsToRemove.length !== 0) {
        unitSummariesAdapter.removeMany(state, idsToRemove);
      }
    });
    builder.addCase(closeUnit.fulfilled, (state, action) => {
      if (action.payload.data !== undefined) {
        console.log({ closing: action.payload.data });
        unitSummariesAdapter.upsertOne(state, action.payload.data);
      }
    });
    builder.addCase(removeUnitEndTag.fulfilled, (state, action) => {
      if (action.payload.openOnPageUnit !== undefined) {
        unitSummariesAdapter.updateOne(state, {
          id: action.payload.openOnPageUnit,
          changes: {
            End: [-1, -1, -1],
          },
        });
      } else if (action.payload.openUnitFromPreviousPage !== undefined) {
        unitSummariesAdapter.removeOne(
          state,
          action.payload.openUnitFromPreviousPage.Id
        );
      }
    });
    builder.addCase(moveUnit.fulfilled, (state, action) => {
      unitSummariesAdapter.upsertMany(state, action.payload.data);
    });
    builder.addCase(discardSegmentationChanges.fulfilled, (state, action) => {
      unitSummariesAdapter.setAll(state, action.payload.units);
    });
    builder.addCase(discardTokenChanges.fulfilled, (state, action) => {
      unitSummariesAdapter.setAll(state, action.payload.Units);
    });
    builder.addCase(saveSegmentation.fulfilled, (state, action) => {
      unitSummariesAdapter.setAll(state, action.payload.units);
    });
  },
});

export type UnitSummariesState = {
  [unitSummariesSlice.name]: EntityState<IUnitSummary>;
};

export const {
  loadUnitSummaries,
  clearUnitSummaries,
  insertUnit,
  updateUnit,
  updateManyUnits,
  removeUnit,
  replaceUnit,
  swapUnits,
} = unitSummariesSlice.actions;
