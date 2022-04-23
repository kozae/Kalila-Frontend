import './index.module.scss';
import { useNavbarMessage, withTransition } from '@frontend/shared-ui';
import { useEffect } from 'react';

/* eslint-disable-next-line */
export interface ImageCycleAnalysisProps {}

import dynamic from 'next/dynamic';
import Button from '@mui/material/Button';

const WasmComponent = dynamic(
  {
    loader: async () => {
      const wasmModule = await import('edition-page-store');
      return () => (
        <Button onClick={() => wasmModule.greet('Mahmoud')}>Greet</Button>
      );
    },
  },
  { ssr: false }
);
export function ImageCycleAnalysis(props: ImageCycleAnalysisProps) {
  useNavbarMessage(['Image Cycle Analysis:', 'Select Tool']);

  return (
    <div>
      <h1>Welcome to ImageCycleAnalysis!</h1>
      <WasmComponent />
    </div>
  );
}

export default withTransition(ImageCycleAnalysis, {});
