import styles from './facsimile-highlighter.module.scss';
import { useEffect } from 'react';

/* eslint-disable-next-line */
export interface UiFacsimileHighlighterProps {}

export function FacsimileHighlighter(props: UiFacsimileHighlighterProps) {
  useEffect(() => {
    import('./wasm').then(({ start }) => {
      start();
    });
  }, []);

  return (
    <div className={styles['container']}>
      <canvas id="canvas" tabIndex={0} height="600" width="600">
        Your browser does not support the canvas.
      </canvas>
    </div>
  );
}

export default FacsimileHighlighter;
