import Popper from '@mui/material/Popper';
import { MediaTypes, paramsSerializer, stringHasValue } from '@frontend/util';
import useSWR from 'swr';
import axios from 'axios';
import {
  FramerRollDown,
  kalilaTheme,
  selectAccessToken,
  useAppSelector,
} from '@frontend/shared-ui';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import { IPageTranscriptionSummary } from '@frontend/domain';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import InfoTwoToneIcon from '@mui/icons-material/InfoTwoTone';
import React from 'react';
import DashboardTwoToneIcon from '@mui/icons-material/DashboardTwoTone';
import ReorderSharpIcon from '@mui/icons-material/ReorderSharp';
import TableRowsTwoToneIcon from '@mui/icons-material/TableRowsTwoTone';
import HistoryEduTwoToneIcon from '@mui/icons-material/HistoryEduTwoTone';

export interface IPagePreviewProps {
  pageId?: string;
  manuscriptId: string;
  anchor: HTMLElement | null;
}

export const PagePreviewPopper = ({
  pageId,
  anchor,
  manuscriptId,
}: IPagePreviewProps) => {
  const accessToken = useAppSelector(selectAccessToken);
  const { data: pageSummary, isValidating } = useSWR<IPageTranscriptionSummary>(
    pageId && accessToken ? `${manuscriptId}${pageId}_summary` : null,
    () => fetch(pageId as string, manuscriptId, accessToken)
  );

  return (
    <Popper id={pageId} open={stringHasValue(pageId)} anchorEl={anchor}>
      <FramerRollDown visibleWhen={pageId !== undefined}>
        <Stack
          key={pageId ?? 'page-preview-popper-content'}
          sx={{
            bgcolor: 'background.paper',
            mt: '5px',
            width: '50vw',
            height: 'fit-content',
            borderRadius: '10px',
            boxShadow: kalilaTheme.shadows[4],
          }}
          alignItems="center"
        >
          {isValidating && <CircularProgress size={180} />}
          {!isValidating && pageSummary !== undefined && (
            <Stack
              direction="row"
              p="10px"
              width="50vw"
              maxHeight="calc(100vh - 110px - 10px)"
              justifyContent="space-between"
            >
              <img
                width="60%"
                height="auto"
                src={pageSummary.FacsimileImageUrl}
                alt="loading"
              />
              <Stack width="39%">
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <InfoTwoToneIcon />
                    </ListItemIcon>
                    <ListItemText
                      disableTypography
                      sx={{ fontSize: '.85rem' }}
                      primary={
                        pageSummary.Tags.length !== 0
                          ? pageSummary.Tags.join(', ')
                          : 'No Tags'
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <DashboardTwoToneIcon />
                    </ListItemIcon>
                    <ListItemText
                      disableTypography
                      sx={{ fontSize: '.85rem' }}
                      primary={
                        pageSummary.NumberOfTextElements === 0 &&
                        pageSummary.NumberOfImageElements === 0
                          ? 'Layout analysis not done'
                          : `${pageSummary.NumberOfTextElements} text element(s) and ${pageSummary.NumberOfImageElements} image element(s)`
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <ReorderSharpIcon />
                    </ListItemIcon>
                    <ListItemText
                      disableTypography
                      sx={{ fontSize: '.85rem' }}
                      primary={
                        pageSummary.NumberOfLines === 0
                          ? 'Line detection not done'
                          : `${pageSummary.NumberOfLines} lines`
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <HistoryEduTwoToneIcon />
                    </ListItemIcon>
                    <ListItemText
                      disableTypography
                      sx={{ fontSize: '.85rem' }}
                      primary={
                        pageSummary.NumberOfTokens === 0
                          ? 'Transcription not done'
                          : `${pageSummary.NumberOfTokens} tokens`
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <TableRowsTwoToneIcon />
                    </ListItemIcon>
                    <ListItemText
                      disableTypography
                      sx={{ fontSize: '.85rem' }}
                      primary={
                        pageSummary.Units.length !== 0
                          ? `${
                              pageSummary.Units.length
                            } units:   ${pageSummary.Units.map(
                              (u) => u.BookUnit
                            ).join(', ')}`
                          : 'Not segmented '
                      }
                    />
                  </ListItem>
                </List>
              </Stack>
            </Stack>
          )}
        </Stack>
      </FramerRollDown>
    </Popper>
  );
};

async function fetch(
  pageId: string,
  manuscriptId: string,
  accessToken: string | undefined
) {
  const { data } = await axios.get(`/server/api/v1/PageTranscription/Summary`, {
    headers: {
      Authorization: accessToken ? `Bearer ${accessToken}` : '',
      Accept: MediaTypes.FolioTranscriptionSummary,
    },
    params: {
      ManuscriptId: manuscriptId,
      Ids: [pageId],
    },
    paramsSerializer,
  });
  return data[0];
}
