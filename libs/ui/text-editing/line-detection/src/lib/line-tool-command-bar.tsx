import Stack from '@mui/material/Stack';
import {
  ApiClient,
  addLine,
  kalilaTheme,
  onElementSelected,
  selectAllLines,
  selectAllTextElements,
  selectCurrentPageId,
  selectCurrentPageManuscriptId,
  selectCurrentPageNumber,
  selectNumberOfLinesInElements,
  selectPageHasTranscription,
  selectTextEditingToolMode,
  setTextEditingToolMode,
  useAppDispatch,
  useAppSelector,
} from '@frontend/shared-ui';
import Button from '@mui/material/Button';
import MoveUpTwoToneIcon from '@mui/icons-material/MoveUpTwoTone';
import AddBoxTwoToneIcon from '@mui/icons-material/AddBoxTwoTone';
import DeleteSweepTwoToneIcon from '@mui/icons-material/DeleteSweepTwoTone';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import React, { useCallback } from 'react';
import { flattenDeep, orderBy } from 'lodash';
import Divider from '@mui/material/Divider';
import { useSingleLineGenerationHandler } from './hooks';
import * as uuid from 'uuid';
import { ITextElement, IToken } from '@frontend/domain';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import { useRouter } from 'next/router';

export const LineToolCommandBar = () => {
  const toolMode = useAppSelector(selectTextEditingToolMode);
  const pageNumber = useAppSelector(selectCurrentPageNumber);
  const manuscriptId = useAppSelector(selectCurrentPageManuscriptId);
  const pageId = useAppSelector(selectCurrentPageId);
  const pageHasTranscription = useAppSelector(selectPageHasTranscription);
  const textElements = orderBy(useAppSelector(selectAllTextElements), 'Order');

  const mainBodyElements = textElements
    .filter((el) => el.Position.startsWith('main'))
    .map((el, i) => ({ ...el, Order: i + 1 }));

  const numberOfBodyLines = useAppSelector((state) =>
    selectNumberOfLinesInElements(
      state,
      mainBodyElements.map((el) => el.Id)
    )
  );

  const otherElements = textElements
    .filter((el) => !el.Position.startsWith('main'))
    .map((el, i) => ({ ...el, Order: i + 1 }));

  const numberOfOtherLines = useAppSelector((state) =>
    selectNumberOfLinesInElements(
      state,
      otherElements.map((el) => el.Id)
    )
  );

  const [addLineAnchorEl, setAddLineAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const open = Boolean(addLineAnchorEl);
  const handleAddLineClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAddLineAnchorEl(event.currentTarget);
  };
  const handleAddLineMenuClose = () => {
    setAddLineAnchorEl(null);
  };

  const dispatch = useAppDispatch();
  const createASingleLine = useSingleLineGenerationHandler();
  const handleCreateClick = (
    el: Omit<ITextElement, 'Lines'>,
    order: number
  ) => {
    const id = uuid.v4();
    const line = createASingleLine(el, id, order);
    dispatch(addLine(line));
    handleAddLineMenuClose();
    dispatch(onElementSelected({ Id: id, Region: line.FacsimileRegion }));
  };

  const lines = useAppSelector(selectAllLines).map(
    ({ ElementId, Id, LineOrder }) => ({ ElementId, Id, LineOrder })
  );

  const postImportedTokens = useCallback(
    async (jsonData: any) => {
      const morphology = await getMorphology(jsonData);
      await postTokens(jsonData, morphology, { manuscriptId, pageId });
    },
    [manuscriptId, pageId]
  );

  const router = useRouter();

  const importTranscription = useCallback(
    async (data: any) => {
      const response = await axios.post(
        `/api/import-transcription/fol.${pageNumber}`,
        data
      );
      await postImportedTokens(response.data);
      router.reload();
    },
    [pageNumber]
  );

  const canDeleteAll = !pageHasTranscription;
  return (
    <Stack
      direction="row"
      sx={{
        width: '100%',
        bgcolor: 'white',
        boxShadow: kalilaTheme.shadows[4],
        position: 'sticky',
        top: 0,
        left: 0,
        zIndex: 1,
      }}
      justifyContent="space-between"
      alignItems="center"
      spacing={2}
    >
      {toolMode === 'default' && (
        <>
          <Button
            size="small"
            startIcon={<AddBoxTwoToneIcon />}
            endIcon={<ArrowDropDownIcon />}
            variant="text"
            color="secondary"
            onClick={handleAddLineClick}
          >
            Define line in...
          </Button>
          <Menu
            id="add-line-menu"
            anchorEl={addLineAnchorEl}
            open={open}
            onClose={handleAddLineMenuClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            {mainBodyElements.map((el) => (
              <MenuItem
                key={el.Id}
                onClick={() => handleCreateClick(el, numberOfBodyLines)}
              >{`${el.Order}. ${el.Position}`}</MenuItem>
            ))}
            <Divider />
            {otherElements.map((el) => (
              <MenuItem
                key={el.Id}
                onClick={() => handleCreateClick(el, numberOfOtherLines)}
              >{`${el.Order}. ${el.Position}`}</MenuItem>
            ))}
          </Menu>
          {canDeleteAll && (
            <Button
              size="small"
              startIcon={<DeleteSweepTwoToneIcon />}
              variant="text"
              color="warning"
            >
              Delete all lines
            </Button>
          )}
          <Button
            size="small"
            startIcon={<MoveUpTwoToneIcon />}
            variant="text"
            color="secondary"
            onClick={() => dispatch(setTextEditingToolMode('reorder'))}
          >
            Reorder lines
          </Button>
          <Button
            onClick={() => importTranscription(lines)}
            size="small"
            variant="text"
            color="secondary"
          >
            Import
          </Button>
        </>
      )}
      {toolMode === 'reorder' && (
        <Button
          size="small"
          startIcon={<ArrowBackIcon />}
          variant="contained"
          disableElevation
          color="primary"
          onClick={() => dispatch(setTextEditingToolMode('default'))}
        >
          Done
        </Button>
      )}
    </Stack>
  );
};

async function getMorphology(tokens: any): Promise<Record<string, string[]>> {
  const rawTokens = tokens.map(({ Tokens }: any) =>
    Tokens.map(({ RawToken }: any) => RawToken)
  );
  const distinctTokens = new Array(...new Set(flattenDeep(rawTokens)));
  const sentence = distinctTokens.join(' ');
  const { data } = await axios.post<Record<string, string[]>>(
    `${process.env['NEXT_PUBLIC_API_URL']}Morphology`,
    {
      Sentence: sentence,
    }
  );
  return data;
}

async function postTokens(
  upladed: any,
  morphology: Record<string, string[]>,
  params: { manuscriptId: string; pageId: string }
) {
  const data: {
    ElementId: string;
    LineId: string;
    Tokens: Array<IToken>;
  }[] = [];

  upladed.forEach((item: any) => {
    data.push({
      ...item,
      Tokens: item.Tokens.map((t: any) => ({
        ...t,
        Morphology: morphology[t.RawToken] ?? [],
      })),
    });
  });

  await postTokensHTTP(data, params);
}

async function postTokensHTTP(
  data: {
    ElementId: string;
    LineId: string;
    Tokens: Array<IToken>;
  }[],
  { manuscriptId, pageId }: { manuscriptId: string; pageId: string }
) {
  await ApiClient().post(
    `${process.env['NEXT_PUBLIC_API_URL']}PageTranscription/Tokens`,
    data,
    {
      params: { Id: pageId, ManuscriptId: manuscriptId },
      headers: {},
    }
  );
}
