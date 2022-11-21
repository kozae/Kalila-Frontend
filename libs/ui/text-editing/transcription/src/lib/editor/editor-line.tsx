import styles from './editor-line.module.scss';
import { hexToRgba } from '@frontend/util';
import { CSSProperties } from 'react';
import { darken } from '@mui/material';

export const EditorLine = (props: any) => {
  const style: CSSProperties = {
    backgroundColor: props.element.color
      ? hexToRgba(props.element.color, 0.1)
      : 'rgba(0,0,0, 0.2)',
    borderColor: props.element.color
      ? darken(props.element.color, 0.1)
      : 'black',
  };
  return (
    <p style={style} className={styles['line']} {...props.attributes}>
      {props.children}
    </p>
  );
};
