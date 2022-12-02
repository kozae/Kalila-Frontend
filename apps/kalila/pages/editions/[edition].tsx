import {
  disableMaxWidth as disableMaxWidthAction,
  enableMaxWidth as enableMaxWidthAction,
  IPageUnitsUpdate,
  NavMessageBarContext,
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
import { GetStaticPaths, GetStaticProps } from 'next';
import { edition, editions } from '@frontend/server-side-queries';

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
  const messages = useMemo(
    () => [data ? data.Name : '', undefined] as [string, string],
    [data]
  );
  useNavbarMessage(messages);
  const { setPageControls } = React.useContext(NavMessageBarContext);
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
      fetchEditionUpdateByUnitList(editionId, updateInfo),
    []
  );
  const fetchByPage = useCallback(
    (editionId: string, manuscriptId: string, pageNumber: number) =>
      fetchEditionUpdateByPage(editionId, manuscriptId, pageNumber),
    []
  );

  const fetchBookUnits = useCallback(
    (params: { Id: string }) => fetchEditionBookUnits(params),
    []
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
  console.log(data.Name);
  console.log(data.BookUnits.length);
  console.log(data.Manuscripts.length);

  return {
    props: { data },
    // revalidate: 10,
  };
};
