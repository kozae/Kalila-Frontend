import { useEffect, useState } from 'react';
import { useLineDetector } from './use-automatic-line-detector';
import { chunk } from 'lodash';

const M486_113_DATA = [
  {
    Id: '62c693c8797adb1421f040e4',
    Position: 'main body',
    Order: 0,
    FacsimileRegion: [364, 183, 1072, 183, 1072, 439, 364, 439, 0],
    HighlightColor: '#6495ED',
  },
  {
    Id: '62c6944f4375543fa5ff7ea8',
    Position: 'legend',
    Order: 2,
    FacsimileRegion: [361, 414, 346, 999, 157, 994, 172, 409, 91],
    HighlightColor: '#C0392B',
  },
  {
    Id: '62c6944f4375543fa5ff7ea9',
    Position: 'main body',
    Order: 3,
    FacsimileRegion: [341, 1029, 1055, 1044, 1048, 1411, 334, 1396, 1],
    HighlightColor: '#8E44AD',
  },
];

export function UiFacsimileLineDetector() {
  const [image, setImage] = useState<null | string>('M486_113.jpeg');
  useEffect(() => {
    useLineDetector('M486_113.jpeg').then((detector) => {
      const lines = detector.detect_lines_in_region(
        new Uint32Array([364, 183, 1072, 183, 1072, 439, 364, 439, 0]),
        125,
        65
      );
      console.log(chunk(lines, 4));
    });
  }, []);

  return (
    <div>
      <h1>Welcome to UiFacsimileLineDetector!</h1>

      {image && (
        <img
          style={{ border: 'solid black 2px' }}
          width="500"
          height="auto"
          src={image}
          alt="failed"
        />
      )}
    </div>
  );
}

export default UiFacsimileLineDetector;
