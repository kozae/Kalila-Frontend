import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkApi } from '@frontend/shared-ui';
import {
  cleanObject,
  IPagination,
  paramsSerializer,
  setAllNull,
} from '@frontend/util';
import { NextRouter } from 'next/router';

export const changePagination = createAsyncThunk<
  void,
  { pagination: IPagination; router: NextRouter },
  ThunkApi
>(
  'pagedDocuments/changePagination',
  async ({ pagination, router }, { getState }) => {
    const state = getState();
    const { filter, sort } = state.pagedDocuments;
    await router.push({
      pathname: router.pathname,
      query: cleanObject({
        ...filter,
        ...sort,
        PageSize: pagination.itemsPerPage,
        PageNumber: pagination.currentPage,
      }),
    });
  }
);

export const changeSort = createAsyncThunk<
  void,
  { sort: { OrderBy?: string; SortDirection?: string }; router: NextRouter },
  ThunkApi
>('pagedDocuments/changeSort', async ({ sort, router }, { getState }) => {
  const state = getState();
  const { filter, pagination } = state.pagedDocuments;
  await router.push({
    pathname: router.pathname,
    query: cleanObject({
      ...filter,
      ...sort,
      PageSize: pagination.itemsPerPage,
      PageNumber: pagination.currentPage,
    }),
  });
});

export const changeFilter = createAsyncThunk<
  void,
  { filter: Record<string, any>; router: NextRouter },
  ThunkApi
>('pagedDocuments/changeFilter', async ({ filter, router }, { getState }) => {
  const state = getState();
  const { sort, pagination } = state.pagedDocuments;
  await router.push({
    pathname: router.pathname,
    query: cleanObject({
      ...filter,
      ...sort,
      PageSize: pagination.itemsPerPage,
      PageNumber: pagination.currentPage,
    }),
  });
});

export const clearFilter = createAsyncThunk<
  void,
  { router: NextRouter },
  ThunkApi
>('pagedDocuments/clearFilter', async ({ router }, { getState }) => {
  const state = getState();
  const { sort, pagination, filter } = state.pagedDocuments;
  await router.push({
    pathname: router.pathname,
    query: cleanObject({
      ...setAllNull({ ...filter }),
      ...sort,
      PageSize: pagination.itemsPerPage,
      PageNumber: pagination.currentPage,
    }),
  });
});

export const createDocument = createAsyncThunk<
  boolean,
  Record<string, any>,
  ThunkApi
>(
  'pagedDocuments/createDocument',
  async (doc, { getState, rejectWithValue }) => {
    const state = getState();
    const accessToken = state.session.session?.AccessToken;
    const activityName = state.pagedDocuments.activityName;
    try {
      await axios.post(`/server/api/v1/${activityName}`, doc, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return true;
    } catch {
      return rejectWithValue(false);
    }
  }
);

export const updateDocuments = createAsyncThunk<
  boolean,
  { update: Record<string, any>; params: Record<string, any> },
  ThunkApi
>(
  'pagedDocuments/updateDocuments',
  async ({ update, params }, { getState, rejectWithValue }) => {
    const state = getState();
    const accessToken = state.session.session?.AccessToken;
    const activityName = state.pagedDocuments.activityName;
    try {
      await axios.patch(`/server/api/v1/${activityName}`, update, {
        params,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return true;
    } catch {
      return rejectWithValue(false);
    }
  }
);

export const updateOneDocument = createAsyncThunk<
  boolean,
  { update: Record<string, any>; params: Record<string, any> },
  ThunkApi
>(
  'pagedDocuments/updateOneDocument',
  async ({ update, params }, { getState, rejectWithValue }) => {
    const state = getState();
    const accessToken = state.session.session?.AccessToken;
    const activityName = state.pagedDocuments.activityName;
    try {
      await axios.patch(`/server/api/v1/${activityName}/One`, update, {
        params,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return true;
    } catch {
      return rejectWithValue(false);
    }
  }
);

export const adminUpdateDocuments = createAsyncThunk<
  boolean,
  { update: Record<string, any>; params: Record<string, any> },
  ThunkApi
>(
  'pagedDocuments/adminUpdateDocuments',
  async ({ update, params }, { getState, rejectWithValue }) => {
    const state = getState();
    const accessToken = state.session.session?.AccessToken;
    const activityName = state.pagedDocuments.activityName;
    try {
      await axios.patch(`/server/api/v1/${activityName}/Admin`, update, {
        params,
        paramsSerializer,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return true;
    } catch {
      return rejectWithValue(false);
    }
  }
);

export const deleteDocument = createAsyncThunk<
  boolean,
  { id: string; additionalParams: any },
  ThunkApi
>(
  'pagedDocuments/deleteDocument',
  async ({ id, additionalParams }, { getState, rejectWithValue }) => {
    const state = getState();
    const accessToken = state.session.session?.AccessToken;
    const activityName = state.pagedDocuments.activityName;
    additionalParams = additionalParams ?? {};
    try {
      await axios.delete(`/server/api/v1/${activityName}`, {
        params: { Id: id, ...additionalParams },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return true;
    } catch {
      return rejectWithValue(false);
    }
  }
);
