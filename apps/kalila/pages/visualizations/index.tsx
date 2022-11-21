import './index.module.scss';
import { useNavbarMessage, withTransition } from '@frontend/shared-ui';
import dynamic from 'next/dynamic';

const DisseminationMap = dynamic(
  () => import('@frontend/ui/visualizations/dissemination-map'),
  { ssr: false }
);

export function Visualizations() {
  useNavbarMessage(['Visualizations', undefined]);
  return <DisseminationMap />;
}

export default withTransition(Visualizations, {});
