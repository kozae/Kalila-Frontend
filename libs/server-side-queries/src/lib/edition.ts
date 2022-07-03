import axios from 'axios';
import { MediaTypes, paramsSerializer } from '@frontend/util';

export async function edition() {
  const { data } = await axios.get(`http://localhost:6688/v1/Editions/test`, {
    params: {
      MSS: [
        '626c1d0e6d603a78104b2259', //P3473
        '626c1d0e6d603a78104b2260', // BWII672
        '626c1d0e6d603a78104b2293', // P3465
        '626c1d0e6d603a78104b226f', // R3655
        '626c1d0e6d603a78104b2278', // P3475
        '626c1d0e6d603a78104b225e', // R2536
        '626c1d0e6d603a78104b2295', // A4095
        '626c1d0e6d603a78104b2261', // L8751
        '626c1d0e6d603a78104b2297', // L4044
        '626c1d0e6d603a78104b2294', // P3466
        '626c1d0e6d603a78104b2258', // P5881
        '626c1d0e6d603a78104b225f', // P400
        '626c1d0e6d603a78104b225d', // CCCP578
        '626c1d0e6d603a78104b2296', // P3471
      ],
    },
    paramsSerializer,
    headers: {
      Accept: MediaTypes.JSON,
    },
  });
  return data;
}
