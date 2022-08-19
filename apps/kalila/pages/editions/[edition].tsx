import { useNavbarMessage, withTransition } from '@frontend/shared-ui';
import { GetServerSideProps } from 'next';
import { edition, editions } from '@frontend/server-side-queries';
import { EditionPageWasm } from '@frontend/ui/editions';
import Head from 'next/head';
import React from 'react';

export function Edition({ data }) {
  useNavbarMessage([data.Name, undefined]);

  return data ? (
    <>
      <Head>
        <title>{data.Name}</title>
      </Head>
      <EditionPageWasm data={data} />
    </>
  ) : (
    <h1>Loading...</h1>
  );
}

export default withTransition(Edition, {});

// export const getStaticPaths: GetStaticPaths = async () => {
//   const editionIds = await editions();
//   console.log({ editionIds });
//   return {
//     paths: [{ params: editionIds.map((id) => ({ edition: id })) }],
//     fallback: true,
//   };
// };

export const getServerSideProps: GetServerSideProps = async (context) => {
  const data = await edition(context.params['edition'] as string);
  console.log('building edition');
  console.log(data.BookUnits.length);
  console.log(data.Manuscripts.length);
  return {
    props: { data },
  };
};
