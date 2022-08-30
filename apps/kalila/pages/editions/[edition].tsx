import {
  disableMaxWidth as disableMaxWidthAction,
  enableMaxWidth as enableMaxWidthAction,
  hideControlBar,
  IPageUnitsUpdate,
  selectAccessToken,
  selectNavControlBarIsShown,
  selectUser,
  showControlBar,
  transformGroupName,
  useAppDispatch,
  useAppSelector,
  useNavbarMessage,
  useSignalrConnection,
  useSignalrMethods,
  useSignalrUpdate,
  withTransition,
} from '@frontend/shared-ui';
import { GetStaticPaths, GetStaticProps } from 'next';
import { edition, editions } from '@frontend/server-side-queries';

import Head from 'next/head';
import React, { useCallback, useEffect, useMemo } from 'react';
import {
  KalilaEditionContainer,
  fetchEditionUpdateByUnitList,
  fetchEditionUpdateByPage,
} from '@frontend/kalila/components';
import { HubConnection } from '@microsoft/signalr';

export function Edition({ data }) {
  useNavbarMessage([data ? data.Name : '', undefined]);
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const username = useMemo(() => user?.name, [user]);
  const showNavbar = useAppSelector(selectNavControlBarIsShown);
  const accessToken = useAppSelector(selectAccessToken);
  const setShowNavbar = (v: boolean) => {
    if (v) {
      dispatch(showControlBar());
    } else {
      dispatch(hideControlBar());
    }
  };
  const disableMaxWidth = () => {
    dispatch(disableMaxWidthAction());
  };
  const enableMaxWidth = () => {
    dispatch(enableMaxWidthAction());
  };
  const { update } = useSignalrUpdate();
  const { isConnected, connection } = useSignalrConnection();
  const { joinGroup, leaveGroup } = useSignalrMethods();
  useEffect(() => {
    if (connection && isConnected && joinGroup) {
      joinGroup(transformGroupName('Edition'), connection).then(() =>
        console.log(`Edition group joined`)
      );
    }
  }, [isConnected, connection]);

  useEffect(() => {
    return () => {
      if (leaveGroup) {
        leaveGroup(
          transformGroupName('Edition'),
          connection as HubConnection
        ).then(() => console.log(`Edition group left`));
      }
    };
  }, []);
  const fetchByUnit = useCallback(
    (editionId: string, updateInfo: IPageUnitsUpdate) =>
      fetchEditionUpdateByUnitList(editionId, updateInfo, accessToken),
    [accessToken]
  );
  const fetchByPage = useCallback(
    (editionId: string, manuscriptId: string, pageNumber: number) =>
      fetchEditionUpdateByPage(
        editionId,
        manuscriptId,
        pageNumber,
        accessToken
      ),
    [accessToken]
  );
  return data ? (
    <>
      <Head>
        <title>{data.Name}</title>
      </Head>
      <KalilaEditionContainer
        {...{
          data,
          username,
          showNavbar,
          setShowNavbar,
          disableMaxWidth,
          enableMaxWidth,
          realTime: {
            update,
            fetchEditionUpdateByUnitList: fetchByUnit,
            fetchEditionUpdateByPage: fetchByPage,
          },
        }}
      />
    </>
  ) : (
    <h1>Loading ...</h1>
  );
}

export default withTransition(Edition, {});

export const getStaticPaths: GetStaticPaths = async () => {
  const editionIds = await editions();
  return {
    paths: editionIds.map(({ Id }) => ({ params: { edition: Id } })),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const data = await edition(context.params['edition'] as string);
  console.log('building edition');
  console.log(data.BookUnits.length);
  console.log(data.Manuscripts.length);
  return {
    props: { data },
  };
};
