import { useNavbarMessage, withTransition } from '@frontend/shared-ui';
import { edition } from '@frontend/server-side-queries';
import { useEffect } from 'react';
import { EditionPage } from '@frontend/ui/editions';

const TEST_MSS = [
  '62594d26d52306f6d1618d2d',
  '62594d26d52306f6d1618cf5',
  '62594d26d52306f6d1618d2f',
  '62594d26d52306f6d1618cf9',
  '62594d26d52306f6d1618d2b',
  '62594d26d52306f6d1618d2e',
  '62594d26d52306f6d1618cf0',
  '62594d26d52306f6d1618cf7',
  '62594d26d52306f6d1618cf6',
];

export function Edition({ data }) {
  useNavbarMessage(['Edition', undefined]);

  return <EditionPage edition={data} />;
}

export default withTransition(Edition, {});

export async function getStaticPaths() {
  return {
    paths: [{ params: { edition: 'test' } }],
    fallback: true,
  };
}

export async function getStaticProps(context) {
  const data = await edition();
  return {
    props: { data },
  };
}
