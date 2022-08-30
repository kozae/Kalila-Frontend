import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { ChangeEvent, FC, useCallback, useContext } from 'react';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import { useXLargeScreenMediaQuery } from '@frontend/shared-ui';
import Button from '@mui/material/Button';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import SearchIcon from '@mui/icons-material/Search';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import PreviewIcon from '@mui/icons-material/Preview';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import ViewComfyIcon from '@mui/icons-material/ViewComfy';
import { StructurePositions } from './structure/render';
import { useRouter } from 'next/router';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import CloseIcon from '@mui/icons-material/Close';
import {
  useBehaviorOptions,
  useBehaviorOptionsMethods,
  useLayoutOptions,
  useLayoutOptionsMethods,
  useSearchData,
  useSearchMethods,
} from './contexts';
import { EditionFontFamily, EditionFontSize } from './models';
import { FONT_FAMILIES } from './constants';

export const EditionCommandBar: FC<{
  editionName: string;
  username: string | undefined;
  showNavbar: boolean;
  setShowNavbar: (v: boolean) => void | Promise<void>;
  onNextSearchResult: () => void | Promise<void>;
  onPrevSearchResult: () => void | Promise<void>;
}> = ({
  editionName,
  username,
  showNavbar,
  setShowNavbar,
  onNextSearchResult,
  onPrevSearchResult,
}) => {
  const { searchResults, currentSearchResult, filter } = useSearchData();
  const { setFilter } = useSearchMethods();
  const { size, font } = useLayoutOptions();
  const {
    structureViz,
    isSearchActive,
    enableFacsimilePreview,
    enableRealTimeUpdates,
  } = useBehaviorOptions();
  const {
    setSize,

    setFont,
  } = useLayoutOptionsMethods();
  const {
    setIsSearchActive,
    setEnableFacsimilePreview,
    setEnableRealTimeUpdates,
    setStructureViz,
  } = useBehaviorOptionsMethods();
  const isXLScreen = useXLargeScreenMediaQuery();

  const handleFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };

  const handleSizeChange = (event: any, newSize: EditionFontSize | null) => {
    setSize(newSize ?? 'xs');
  };

  const handleFontChange = (event: any, newFont: EditionFontFamily | null) => {
    setFont(newFont ?? 'n');
  };

  const toggleFacsimilePreview = () => {
    setEnableFacsimilePreview((prev) => !prev);
  };

  const router = useRouter();
  const handleRealTimeUpdateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEnableRealTimeUpdates(event.target.checked);
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
  const toggleStructureViz = useCallback(() => {
    if (structureViz) {
      setStructureViz(null);
    } else {
      setStructureViz('bottom');
    }
  }, [structureViz]);
  const toggleFullScreen = useCallback(() => {
    setShowNavbar(!showNavbar);
  }, [showNavbar]);

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
          <Button
            onClick={() => toggleStructureViz()}
            startIcon={
              <ViewComfyIcon
                sx={{ color: structureViz !== null ? 'white' : '#CCCCCC' }}
              />
            }
          >
            <Typography
              color={structureViz !== null ? 'white' : '#CCCCCC'}
              fontSize=".8rem"
            >
              Map
            </Typography>
          </Button>
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
        </Stack>
        <Button
          onClick={() => toggleFullScreen()}
          startIcon={
            <FullscreenIcon sx={{ color: !showNavbar ? 'white' : '#CCCCCC' }} />
          }
        >
          <Typography
            color={!showNavbar ? 'white' : '#CCCCCC'}
            fontSize=".8rem"
          >
            Fullscreen
          </Typography>
        </Button>

        <Button
          onClick={() => toggleFacsimilePreview()}
          startIcon={
            <PreviewIcon
              sx={{ color: enableFacsimilePreview ? 'white' : '#CCCCCC' }}
            />
          }
        >
          <Typography
            color={enableFacsimilePreview ? 'white' : '#CCCCCC'}
            fontSize=".8rem"
          >
            Facsimile
          </Typography>
        </Button>
        {!isSearchActive && username && !username.includes('guest') && (
          <Stack marginLeft="10px" direction="row" alignItems="center">
            <CloudSyncIcon
              sx={{ color: enableRealTimeUpdates ? 'white' : '#CCCCCC' }}
            />
            <Typography
              color={enableRealTimeUpdates ? 'white' : '#CCCCCC'}
              fontSize=".8rem"
            >
              &nbsp;Updates
            </Typography>
            <Switch
              color="secondary"
              checked={enableRealTimeUpdates}
              onChange={handleRealTimeUpdateChange}
            />
          </Stack>
        )}
        {!isSearchActive && (
          <Button
            onClick={() => setIsSearchActive(true)}
            startIcon={<SearchIcon sx={{ color: '#CCCCCC' }} />}
          >
            <Typography color="#CCCCCC" fontSize=".8rem">
              Search...
            </Typography>
          </Button>
        )}
        {isSearchActive && (
          <Stack
            direction="row"
            alignItems="center"
            width="300px"
            height="100%"
          >
            <Box width="300px">
              <TextField
                fullWidth
                value={filter}
                onChange={handleFilterChange}
                placeholder="Search unit titles, numbers, or content"
                InputProps={{
                  sx: {
                    color: 'white',
                  },
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'white' }} />
                    </InputAdornment>
                  ),
                }}
                variant="standard"
              />
            </Box>
            {searchResults && (
              <Stack height="100%" direction="row">
                <Stack justifyContent="center" height="100%">
                  <ArrowDropUpIcon
                    onClick={onPrevSearchResult}
                    fontSize="small"
                    sx={{ color: 'white', cursor: 'pointer' }}
                  />
                  <ArrowDropDownIcon
                    onClick={onNextSearchResult}
                    fontSize="small"
                    sx={{ color: 'white', cursor: 'pointer' }}
                  />
                </Stack>
                <Stack justifyContent="center" height="100%">
                  <Typography fontSize=".5rem" color="white">
                    {currentSearchResult + 1}
                  </Typography>
                  <Typography fontSize=".5rem" color="white">
                    of: {searchResults.length}
                  </Typography>
                </Stack>
              </Stack>
            )}
            <IconButton
              onClick={() => {
                setFilter('');
                setIsSearchActive(false);
              }}
            >
              <CloseIcon sx={{ color: 'white' }} />
            </IconButton>
          </Stack>
        )}
        {!isSearchActive && username && !username.includes('guest') && (
          <Button
            disabled
            startIcon={<EditTwoToneIcon sx={{ color: '#CCCCCC' }} />}
          >
            <Typography color="#CCCCCC" fontSize=".8rem">
              Edit...
            </Typography>
          </Button>
        )}
      </Stack>
    </Stack>
  );
};
