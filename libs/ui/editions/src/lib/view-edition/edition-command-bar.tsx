import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { ChangeEvent, FC, useContext } from 'react';
import {
  EditionFontFamily,
  EditionFontSize,
  FONT_FAMILIES,
  ViewEditionContext,
} from './view-edition-context';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import {
  hideControlBar,
  selectNavControlBarIsShown,
  showControlBar,
  useAppDispatch,
  useAppSelector,
  useXLargeScreenMediaQuery,
} from '@frontend/shared-ui';
import Button from '@mui/material/Button';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import SearchIcon from '@mui/icons-material/Search';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import PreviewIcon from '@mui/icons-material/Preview';
import HorizontalSplitIcon from '@mui/icons-material/HorizontalSplit';
import ViewComfyIcon from '@mui/icons-material/ViewComfy';
import { StructurePositions } from './structure/render';
import { useRouter } from 'next/router';

export const EditionCommandBar: FC<{ editionName: string }> = ({
  editionName,
}) => {
  const {
    size,
    setSize,
    font,
    setFont,
    enableFacsimilePreview,
    setEnableFacsimilePreview,
    realTimeUpdates,
    setRealTimeUpdates,
    structureViz,
    setStructureViz,
  } = useContext(ViewEditionContext);
  const showNavbar = useAppSelector(selectNavControlBarIsShown);
  const isXLScreen = useXLargeScreenMediaQuery();

  const handleSizeChange = (event: any, newSize: EditionFontSize | null) => {
    setSize(newSize ?? 'xs');
  };

  const handleFontChange = (event: any, newFont: EditionFontFamily | null) => {
    setFont(newFont ?? 'n');
  };

  const handleFacsimilePreviewChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setEnableFacsimilePreview(event.target.checked);
  };

  const router = useRouter();
  const handleRealTimeUpdateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRealTimeUpdates(event.target.checked);
    if (event.target.checked) {
      router.reload();
    }
  };

  const handleStructureVizPositionChange = (
    event: any,
    newState: StructurePositions | 'hide' | null
  ) => {
    if (newState === 'hide') {
      setStructureViz(null);
    } else {
      setStructureViz(newState);
    }
  };
  const handleStructureVizVisibilityChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.checked) {
      setStructureViz('left');
    } else {
      setStructureViz(null);
    }
  };
  const dispatch = useAppDispatch();
  const handleShowNavbarChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      dispatch(showControlBar());
    } else {
      dispatch(hideControlBar());
    }
  };

  return (
    <Stack
      sx={{
        position: 'fixed',
        top: showNavbar ? 60 : 0,
        height: '50px',
        width: '100%',
        zIndex: showNavbar ? 60 : 80,
        bgcolor: showNavbar ? 'none' : 'primary.main',
      }}
    >
      {!showNavbar && (
        <Typography
          sx={{
            position: 'absolute',
            left: isXLScreen ? 'calc((100% - 1600px) / 2)' : 0,
            bgcolor: 'none',
            width: 'fit-content',
            p: '0.5rem',
            color: 'white',
            fontSize: '1.2rem',
          }}
        >
          {editionName}
        </Typography>
      )}
      <Stack
        sx={{
          position: 'absolute',
          right: isXLScreen ? 'calc((100% - 1600px) / 2)' : 0,
          bgcolor: 'none',
          height: '50px',
          width: 'fit-content',
          pt: '2px',
          pb: '2px',
        }}
        spacing={3}
        direction="row"
      >
        <ToggleButtonGroup
          value={size}
          color="secondary"
          exclusive
          onChange={handleSizeChange}
          aria-label="text alignment"
        >
          <ToggleButton value="xs" aria-label="x-small">
            <Typography
              color={size === 'xs' ? 'white' : '#CCCCCC'}
              fontSize=".8rem"
            >
              XS
            </Typography>
          </ToggleButton>
          <ToggleButton value="s" aria-label="small">
            <Typography
              color={size === 's' ? 'white' : '#CCCCCC'}
              fontSize=".8rem"
            >
              S
            </Typography>
          </ToggleButton>
          <ToggleButton value="m" aria-label="medium">
            <Typography
              color={size === 'm' ? 'white' : '#CCCCCC'}
              fontSize=".8rem"
            >
              M
            </Typography>
          </ToggleButton>
          <ToggleButton value="l" aria-label="large">
            <Typography
              color={size === 'l' ? 'white' : '#CCCCCC'}
              fontSize=".8rem"
            >
              L
            </Typography>
          </ToggleButton>
          <ToggleButton value="xl" aria-label="x-large">
            <Typography
              color={size === 'xl' ? 'white' : '#CCCCCC'}
              fontSize=".8rem"
            >
              XL
            </Typography>
          </ToggleButton>
        </ToggleButtonGroup>
        <ToggleButtonGroup
          value={font}
          color="secondary"
          exclusive
          onChange={handleFontChange}
          aria-label="font face"
        >
          <ToggleButton value="n" aria-label="small">
            <Typography
              color={font === 'n' ? 'white' : '#CCCCCC'}
              fontSize=".8rem"
              fontFamily={FONT_FAMILIES['n']}
            >
              نوتو-نسخ
            </Typography>
          </ToggleButton>
          <ToggleButton value="a" aria-label="large">
            <Typography
              color={font === 'a' ? 'white' : '#CCCCCC'}
              fontSize=".8rem"
              fontFamily={FONT_FAMILIES['a']}
            >
              أميري
            </Typography>
          </ToggleButton>
        </ToggleButtonGroup>
        <Stack
          alignItems="center"
          direction="row"
          border={structureViz !== null ? 'white solid .5px' : 'none'}
          borderRadius="5px"
        >
          {structureViz !== null && <ViewComfyIcon sx={{ color: 'white' }} />}
          {structureViz !== null && (
            <Typography color="white" fontSize=".8rem">
              &nbsp;Map&nbsp;
            </Typography>
          )}
          {structureViz !== null && (
            <ToggleButtonGroup
              value={structureViz}
              color="secondary"
              exclusive
              onChange={handleStructureVizPositionChange}
              aria-label="structure viz toggle"
            >
              <ToggleButton value="left" aria-label="small">
                <Typography
                  color={structureViz === 'left' ? 'white' : '#CCCCCC'}
                  fontSize=".8rem"
                >
                  left [fit]
                </Typography>
              </ToggleButton>
              <ToggleButton value="left-XL" aria-label="small">
                <Typography
                  color={structureViz === 'left-XL' ? 'white' : '#CCCCCC'}
                  fontSize=".8rem"
                >
                  left
                </Typography>
              </ToggleButton>
              <ToggleButton value="bottom" aria-label="large">
                <Typography
                  color={structureViz === 'bottom' ? 'white' : '#CCCCCC'}
                  fontSize=".8rem"
                >
                  bottom
                </Typography>
              </ToggleButton>
            </ToggleButtonGroup>
          )}
          <Stack direction="row" alignItems="center">
            {structureViz === null && (
              <ViewComfyIcon fontSize="small" sx={{ color: '#CCCCCC' }} />
            )}
            {structureViz === null && (
              <Typography color="#CCCCCC" fontSize=".8rem">
                &nbsp;Map
              </Typography>
            )}
            <Switch
              color="secondary"
              checked={structureViz !== null}
              onChange={handleStructureVizVisibilityChange}
            />
          </Stack>
        </Stack>

        <Stack marginLeft="10px" direction="row" alignItems="center">
          <HorizontalSplitIcon
            sx={{ color: showNavbar ? 'white' : '#CCCCCC' }}
          />
          <Typography color={showNavbar ? 'white' : '#CCCCCC'} fontSize=".8rem">
            &nbsp;Navbar
          </Typography>
          <Switch
            color="secondary"
            checked={showNavbar}
            onChange={handleShowNavbarChange}
          />
        </Stack>
        <Stack marginLeft="10px" direction="row" alignItems="center">
          <PreviewIcon
            sx={{ color: enableFacsimilePreview ? 'white' : '#CCCCCC' }}
          />
          <Typography
            color={enableFacsimilePreview ? 'white' : '#CCCCCC'}
            fontSize=".8rem"
          >
            &nbsp;Facsimile
          </Typography>
          <Switch
            color="secondary"
            checked={enableFacsimilePreview}
            onChange={handleFacsimilePreviewChange}
          />
        </Stack>
        <Stack marginLeft="10px" direction="row" alignItems="center">
          <CloudSyncIcon
            sx={{ color: realTimeUpdates ? 'white' : '#CCCCCC' }}
          />
          <Typography
            color={realTimeUpdates ? 'white' : '#CCCCCC'}
            fontSize=".8rem"
          >
            &nbsp;Updates
          </Typography>
          <Switch
            color="secondary"
            checked={realTimeUpdates}
            onChange={handleRealTimeUpdateChange}
          />
        </Stack>
        <Button startIcon={<SearchIcon sx={{ color: 'white' }} />}>
          <Typography color="white" fontSize=".8rem">
            Search...
          </Typography>
        </Button>
        <Button startIcon={<EditTwoToneIcon sx={{ color: 'white' }} />}>
          <Typography color="white" fontSize=".8rem">
            Edit...
          </Typography>
        </Button>
      </Stack>
    </Stack>
  );
};
