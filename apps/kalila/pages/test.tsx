import { GetServerSideProps } from 'next';
import { queryServerSide, sigla } from '@frontend/server-side-queries';

export function Test() {
  return (
    <div>
      <h1>Welcome to Editions!</h1>
    </div>
  );
}

export default Test;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const query = await queryServerSide({ sigla });
  return {
    props: {
      ...query,
    },
  };
};
