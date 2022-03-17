import styles from './editor-text.module.scss';

export const EditorText = (props: any) => {
  return (
    <span className={styles[props.leaf.state]} {...props.attributes}>
      {props.children}
    </span>
  );
};
