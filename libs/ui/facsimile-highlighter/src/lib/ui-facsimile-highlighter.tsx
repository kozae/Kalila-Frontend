import styles from './ui-facsimile-highlighter.module.scss';

/* eslint-disable-next-line */
export interface UiFacsimileHighlighterProps {}

export function UiFacsimileHighlighter(props: UiFacsimileHighlighterProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to UiFacsimileHighlighter!</h1>
    </div>
  );
}

export default UiFacsimileHighlighter;
