import {
  disableMaxWidth as disableMaxWidthAction,
  enableMaxWidth as enableMaxWidthAction,
  IPageUnitsUpdate,
  NavMessageBarContext,
  selectAccessToken,
  selectUser,
  transformGroupName,
  useAppDispatch,
  useAppSelector,
  useNavbarMessage,
  useSignalrConnection,
  useSignalrMethods,
  useSignalrUpdate,
  withTransition,
} from '@frontend/shared-ui';
import { GetServerSideProps } from 'next';
import { edition } from '@frontend/server-side-queries';

import Head from 'next/head';
import React, { useCallback, useEffect, useMemo } from 'react';
import {
  KalilaEditionContainer,
  fetchEditionUpdateByUnitList,
  fetchEditionUpdateByPage,
  fetchEditionBookUnits,
} from '@frontend/kalila/components';
import { HubConnection } from '@microsoft/signalr';
import { AnimatePresence, motion } from 'framer-motion';

export function Edition({ data }) {
  useNavbarMessage([data ? data.Name : '', undefined]);
  const { setPageControls } = React.useContext(NavMessageBarContext);
  const accessToken = useAppSelector(selectAccessToken);
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const username = useMemo(() => user?.name, [user]);
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

  const fetchBookUnits = useCallback(
    (params: { Id: string }) => fetchEditionBookUnits(params, accessToken),
    [accessToken]
  );

  return data ? (
    <>
      <Head>
        <title>{data.Name}</title>
      </Head>
      <AnimatePresence exitBeforeEnter>
        <motion.div
          style={{ width: '100vw' }}
          key={data.Name}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.5, ease: 'easeIn' }}
        >
          <KalilaEditionContainer
            key={data.Name}
            {...{
              data,
              username,
              disableMaxWidth,
              enableMaxWidth,
              setPageControls,
              realTime: {
                update,
                fetchEditionUpdateByUnitList: fetchByUnit,
                fetchEditionUpdateByPage: fetchByPage,
                fetchBookUnits,
              },
            }}
          />
        </motion.div>
      </AnimatePresence>
    </>
  ) : (
    <h1>Loading ...</h1>
  );
}

export default withTransition(Edition, {});

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const data = await edition(context.params['edition'] as string);
    console.log('building edition');
    console.log(data.BookUnits.length);
    console.log(data.Manuscripts.length);
    return {
      props: { data },
    };
  } catch (error) {
    console.log({ error });
    return {
      props: {},
      redirect: {
        destination: '/500',
      },
    };
  }
};
