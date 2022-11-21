import styles from './ui-facsimile-generator.module.scss';
import { useEffect, useState } from 'react';

export function UiFacsimileGenerator() {
  const [image, setImage] = useState<null | string>(null);

  useEffect(() => {
    import('./wasm').then(({ generate_facsimile }) => {
      setImage(generate_facsimile(210, 297));
    });
  }, []);

  return (
    <div className={styles['container']}>
      {image && (
        <img
          src={image}
          style={{ border: 'solid black 2px' }}
          width="500"
          height="auto"
          alt="loading"
        />
      )}
    </div>
  );
}

export default UiFacsimileGenerator;
