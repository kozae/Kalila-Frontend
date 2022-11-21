import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { RefObject, useEffect, useRef, useState } from 'react';
import { IDisseminationMapState, InitState } from './operations';
import { createMap } from './operations/create-map';
import styles from './styles.module.scss';
import { changePhase } from './operations/change-phase';

export const DisseminationMap = () => {
  const ref = useRef<SVGSVGElement>() as RefObject<SVGSVGElement>;
  const [state, setState] = useState<IDisseminationMapState>({
    svg: null,
    globe: null,
    zoom: null,
    projection: null,
    geoPath: null,
    map: {},
    cities: [],
  });
  const [step, setStep] = useState(0);

  useEffect(() => {
    InitState(ref, setState);
  }, []);

  useEffect(() => {
    createMap(state);
  }, [state]);

  useEffect(() => {
    if (state.svg) {
      changePhase(step, state);
    }
  }, [step, state.svg]);

  const nextStep = () => {
    setStep((prevStep) => {
      if (prevStep < 2) {
        return prevStep + 1;
      } else {
        return 0;
      }
    });
  };

  return (
    <Stack sx={{ width: '100%' }} justifyContent="center" alignItems="center">
      <IconButton onClick={nextStep} color="secondary">
        <ChevronRightIcon />
      </IconButton>
      <svg className={styles['svg']} ref={ref} />
    </Stack>
  );
};
