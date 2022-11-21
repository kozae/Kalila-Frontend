import ImageTwoToneIcon from '@mui/icons-material/ImageTwoTone';
import { FC, MouseEvent, useCallback } from 'react';
import { SxProps, Theme } from '@mui/system';
import {
  useAuxiliarySurfacesMethods,
  useBehaviorOptions,
  useLayoutData,
} from '../../../contexts';
import { EditionCellData } from '../../../../store';
import { FONT_SIZES } from '../../../constants';

export const LocatedImage: FC<{
  index: number;
  data: EditionCellData;
  msIndex: number;
}> = ({ index, data, msIndex }) => {
  const { enableFacsimilePreview } = useBehaviorOptions();
  const { setActiveImagePreview } = useAuxiliarySurfacesMethods();
  const { size } = useLayoutData();
  const showImagePreview = useCallback(
    (tokenIndex: number, x: number, y: number) => {
      if (enableFacsimilePreview) {
        setActiveImagePreview({
          manuscriptSiglum: data.get_manuscript_siglum(),
          manuscriptIdx: msIndex,
          page: data.get_page(tokenIndex),
          unitIdx: data.get_unit_idx() as number,
          x,
          y,
        });
      }
    },
    [data, enableFacsimilePreview]
  );

  const hideImagePreview = useCallback(() => {
    if (enableFacsimilePreview) {
      setActiveImagePreview(null);
    }
  }, [enableFacsimilePreview]);

  const iconStyling: () => SxProps<Theme> = useCallback(() => {
    if (enableFacsimilePreview) {
      return {
        p: '3px',
        borderRadius: '5px',
        '&:hover': {
          bgcolor: 'info.dark',
          color: 'white',
        },
      };
    } else {
      return { p: '3px', borderRadius: '5px' };
    }
  }, [enableFacsimilePreview]);

  return (
    <ImageTwoToneIcon
      onMouseLeave={hideImagePreview}
      onMouseEnter={(e: MouseEvent<SVGSVGElement>) =>
        showImagePreview(index, e.clientX, e.clientY)
      }
      sx={{ fontSize: FONT_SIZES[size], ...iconStyling() }}
    />
  );
};
