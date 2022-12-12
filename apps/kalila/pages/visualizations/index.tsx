import './index.module.scss';

import dynamic from 'next/dynamic';
import { useNavbarMessage, withTransition } from '@frontend/kalila/components';

const DisseminationMap = dynamic(
  () => import('@frontend/ui/visualizations/dissemination-map'),
  { ssr: false }
);

export function Visualizations() {
  useNavbarMessage(['Visualizations', undefined]);
  return <DisseminationMap />;
}

export default withTransition(Visualizations, {});
