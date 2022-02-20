import Image from 'next/image';
import { IDisplayFacsimileProps } from '../models';

export const SimpleFullPage = ({
  url,
  width,
  height,
}: IDisplayFacsimileProps) => {
  return (
    <Image
      src={`https://kalila.kozae.de${url}`}
      width={width}
      height={height}
      layout="intrinsic"
      alt="Page Facsimile"
      priority
    />
  );
};
