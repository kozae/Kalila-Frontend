import { useNavbarMessage, withTransition } from '@frontend/shared-ui';
import { edition } from '@frontend/server-side-queries';
import { EditionPage } from '@frontend/ui/editions';

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
  console.log('building edition');
  console.log(data.BookUnits.length);
  console.log(data.Manuscripts.length);
  return {
    props: { data },
  };
}
