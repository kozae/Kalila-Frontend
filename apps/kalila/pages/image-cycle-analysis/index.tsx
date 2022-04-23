import './index.module.scss';
import { useNavbarMessage, withTransition } from '@frontend/shared-ui';
import { greet } from 'edition-page-store';
import Button from '@mui/material/Button';

/* eslint-disable-next-line */
export interface ImageCycleAnalysisProps {}

export function ImageCycleAnalysis(props: ImageCycleAnalysisProps) {
  useNavbarMessage(['Image Cycle Analysis:', 'Select Tool']);

  return (
    <div>
      <h1>Welcome to ImageCycleAnalysis!</h1>
      <Button onClick={() => greet('mahmoud')}>Greet</Button>
    </div>
  );
}

export default withTransition(ImageCycleAnalysis, {});
