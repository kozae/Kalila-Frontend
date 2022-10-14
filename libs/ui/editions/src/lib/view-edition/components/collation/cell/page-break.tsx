import DescriptionIcon from '@mui/icons-material/Description';
import {
  useAuxiliarySurfacesMethods,
  useBehaviorOptions,
  useLayoutData,
} from '../../../contexts';
import { FONT_SIZES } from '../../../constants';
import { FC, MouseEvent, useCallback } from 'react';
import { SxProps, Theme } from '@mui/system';
import { EditionCellData } from '../../../../store';
export const PageBreak: FC<{
  index: number;
  data: EditionCellData;
  msIndex: number;
}> = ({ index, data, msIndex }) => {
  const { enableFacsimilePreview } = useBehaviorOptions();
  const { setActivePagePreview } = useAuxiliarySurfacesMethods();
  const { size } = useLayoutData();
  const showPagePreview = useCallback(
    (tokenIndex: number, x: number, y: number) => {
      if (enableFacsimilePreview) {
        setActivePagePreview({
          manuscriptSiglum: data.get_manuscript_siglum(),
          manuscriptIdx: msIndex,
          page: data.get_page(tokenIndex),
          x,
          y,
        });
      }
    },
    [data, enableFacsimilePreview]
  );

  const hidePagePreview = useCallback(() => {
    if (enableFacsimilePreview) {
      setActivePagePreview(null);
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
    <DescriptionIcon
      onMouseLeave={hidePagePreview}
      onMouseEnter={(e: MouseEvent<SVGSVGElement>) =>
        showPagePreview(index, e.clientX, e.clientY)
      }
      sx={{ fontSize: FONT_SIZES[size], ...iconStyling() }}
    />
  );
};
