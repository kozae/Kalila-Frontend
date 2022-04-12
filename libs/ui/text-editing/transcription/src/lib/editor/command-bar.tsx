import { HistoryEditor } from 'slate-history';
import { ReactEditor } from 'slate-react';
import { BaseEditor, Editor } from 'slate';
import React, { useCallback } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {
  kalilaTheme,
  selectTextEditingToolMode,
  setTextEditingToolMode,
  useAppDispatch,
  useAppSelector,
} from '@frontend/shared-ui';
import Tooltip from '@mui/material/Tooltip';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import PreviewTwoToneIcon from '@mui/icons-material/PreviewTwoTone';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import { SxProps } from '@mui/system/styleFunctionSx';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { TokenState } from '@frontend/domain';

export interface ICommandBarProps {
  editor: BaseEditor & ReactEditor & HistoryEditor;
}

const isSingleWordSelected = (
  editor: BaseEditor & ReactEditor & HistoryEditor
) => {
  const fragment = editor.getFragment();
  if (fragment.length !== 1) {
    return false;
  }
  for (let descendant of fragment) {
    //@ts-ignore
    if (descendant.children.length !== 1) {
      return false;
    }
    //@ts-ignore
    for (let child of descendant.children) {
      const text = child.text.trim();
      const tokens = text.split(/\s+/).filter((t: string) => t.length !== 0);
      if (tokens.length !== 1) {
        return false;
      }
    }
  }

  return true;
};

export const CommandBar = ({ editor }: ICommandBarProps) => {
  const mode = useAppSelector(selectTextEditingToolMode);
  const dispatch = useAppDispatch();
  const setMode = (newMode: 'main-body' | 'secondary-text') =>
    dispatch(setTextEditingToolMode(newMode));
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [menu, setMenu] = React.useState<null | string>(null);
  const open = Boolean(anchorEl);
  const handleMenuButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    menu: string
  ) => {
    setMenu(menu);
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleMode = useCallback(() => {
    setMode(mode === 'main-body' ? 'secondary-text' : 'main-body');
  }, [mode]);

  const tokenStateButtonStyles: SxProps = { p: '1px 4px 1px 4px' };

  const changeState = useCallback(
    (state: TokenState) => {
      if (isSingleWordSelected(editor)) {
        Editor.addMark(editor, 'state', state);
      }
    },
    [editor]
  );

  const backToView = () => {
    dispatch(setTextEditingToolMode('default'));
  };

  return (
    <Stack
      sx={{
        position: 'sticky',
        top: 0,
        bgcolor: 'white',
        width: '100%',
        zIndex: 10,
        boxShadow: kalilaTheme.shadows[4],
        pb: '5px',
      }}
      justifyContent="flex-start"
      alignItems="center"
    >
      <Stack
        flexWrap="wrap"
        sx={{ width: '100%' }}
        justifyContent="space-between"
        alignItems="center"
        direction="row"
        spacing={1}
      >
        <Stack alignItems="center" direction="row">
          <Typography>Word state: &nbsp;</Typography>
          <ButtonGroup variant="outlined">
            <Tooltip title="Sound, ctrl+1" arrow>
              <Button
                onClick={() => changeState('sound')}
                sx={tokenStateButtonStyles}
                size="small"
              >
                &nbsp;&nbsp;&nbsp;
              </Button>
            </Tooltip>
            <Tooltip title="Emended, ctrl+2" arrow>
              <Button
                onClick={() => changeState('emended')}
                sx={tokenStateButtonStyles}
                size="small"
              >
                &nbsp;*&nbsp;
              </Button>
            </Tooltip>
            <Tooltip title="Corrupt, ctrl+3" arrow>
              <Button
                onClick={() => changeState('corrupt')}
                sx={tokenStateButtonStyles}
                size="small"
              >
                &nbsp;&dagger;&nbsp;
              </Button>
            </Tooltip>
            <Tooltip title="Unintelligible, ctrl+4" arrow>
              <Button
                onClick={() => changeState('unintelligible')}
                sx={tokenStateButtonStyles}
                size="small"
              >
                &nbsp;?&nbsp;
              </Button>
            </Tooltip>
            <Tooltip
              title="Dittography, single: ctrl+5, first: ctrl+shift+5, last: alt+ctrl+5"
              arrow
            >
              <Button
                endIcon={<ArrowDropDownIcon />}
                sx={tokenStateButtonStyles}
                size="small"
                onClick={(e) => handleMenuButtonClick(e, 'dittography')}
              >
                [&nbsp;]
              </Button>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              open={open && menu === 'dittography'}
              onClose={handleMenuClose}
            >
              <MenuItem
                onClick={() => {
                  changeState('dittography');
                  handleMenuClose();
                }}
              >
                single&nbsp;<b>[word]</b>&nbsp;dittography
              </MenuItem>
              <MenuItem
                onClick={() => {
                  changeState('dittography_begin');
                  handleMenuClose();
                }}
              >
                dittography&nbsp;<b>[range</b>&nbsp;start
              </MenuItem>
              <MenuItem
                onClick={() => {
                  changeState('dittography_end');
                  handleMenuClose();
                }}
              >
                dittography&nbsp;<b>range]</b>&nbsp;end
              </MenuItem>
            </Menu>
            <Tooltip
              title="Added, single: ctrl+6, first: ctrl+shift+6, last: alt+ctrl+6"
              arrow
            >
              <Button
                endIcon={<ArrowDropDownIcon />}
                sx={tokenStateButtonStyles}
                size="small"
                onClick={(e) => handleMenuButtonClick(e, 'added')}
              >
                {'< >'}
              </Button>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              open={open && menu === 'added'}
              onClose={handleMenuClose}
            >
              <MenuItem
                onClick={() => {
                  changeState('added');
                  handleMenuClose();
                }}
              >
                single added&nbsp;<b>{'<word>'}</b>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  changeState('added_begin');
                  handleMenuClose();
                }}
              >
                added&nbsp;<b>{'<'}range </b>&nbsp;start
              </MenuItem>
              <MenuItem
                onClick={() => {
                  changeState('added_end');
                  handleMenuClose();
                }}
              >
                added&nbsp;<b>range{'>'}</b>&nbsp;end
              </MenuItem>
            </Menu>
            <Tooltip
              title="Crossed-out, single: ctrl+7, first: ctrl+shift+7, last: alt+ctrl+7"
              arrow
            >
              <Button
                endIcon={<ArrowDropDownIcon />}
                sx={tokenStateButtonStyles}
                size="small"
                onClick={(e) => handleMenuButtonClick(e, 'crossed')}
              >
                [[&nbsp;]]
              </Button>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              open={open && menu === 'crossed'}
              onClose={handleMenuClose}
            >
              <MenuItem
                onClick={() => {
                  changeState('cross-out');
                  handleMenuClose();
                }}
              >
                single crossed-out&nbsp;<b>[[word]]</b>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  changeState('cross-out_begin');
                  handleMenuClose();
                }}
              >
                crossed-out&nbsp;<b>[[range</b>&nbsp;start
              </MenuItem>
              <MenuItem
                onClick={() => {
                  changeState('cross-out_end');
                  handleMenuClose();
                }}
              >
                crossed-outed&nbsp;<b>range]]</b>&nbsp;end
              </MenuItem>
            </Menu>
            <Tooltip
              title="Suppletion, single: ctrl+8, first: ctrl+shift+8, last: alt+ctrl+8"
              arrow
            >
              <Button
                endIcon={<ArrowDropDownIcon />}
                sx={tokenStateButtonStyles}
                size="small"
                onClick={(e) => handleMenuButtonClick(e, 'suppletion')}
              >
                {'{ }'}
              </Button>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              open={open && menu === 'suppletion'}
              onClose={handleMenuClose}
            >
              <MenuItem
                onClick={() => {
                  changeState('suppletion');
                  handleMenuClose();
                }}
              >
                single suppleted&nbsp;<b>{'{word}'}</b>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  changeState('suppletion_begin');
                  handleMenuClose();
                }}
              >
                suppleted&nbsp;<b>{'{range'}</b>&nbsp;start
              </MenuItem>
              <MenuItem
                onClick={() => {
                  changeState('suppletion_end');
                  handleMenuClose();
                }}
              >
                suppleted&nbsp;<b>{'range}'}</b>&nbsp;end
              </MenuItem>
            </Menu>
          </ButtonGroup>
        </Stack>

        <Button color="secondary" endIcon={<ArrowDropDownIcon />} size="small">
          Insert
        </Button>
      </Stack>
      <Stack
        sx={{ width: '100%' }}
        justifyContent="center"
        alignItems="center"
        direction="row"
      >
        <Button
          startIcon={<ReadMoreIcon />}
          size="small"
          sx={{ position: 'absolute', right: 0 }}
          onClick={toggleMode}
        >
          {mode !== 'main-body'
            ? 'Edit Main Body'
            : 'Edit Legends and Marginalia'}
        </Button>
        <Typography variant="h2">
          {mode === 'main-body' ? 'Main Body' : 'Legends and Marginalia'}
        </Typography>
        <Button
          startIcon={<PreviewTwoToneIcon />}
          size="small"
          color="secondary"
          sx={{ position: 'absolute', left: 0 }}
          onClick={backToView}
        >
          Back to view & annotate
        </Button>
      </Stack>
    </Stack>
  );
};
