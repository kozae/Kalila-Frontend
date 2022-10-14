import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { TextComponent } from './text';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { DragLayer } from './drag-layer';
import { useState } from 'react';
import { TextSegmentationContext } from './context';
import { UnitsSummary } from './units-summary';

export function TextSegmentationTool() {
  const [updateTime, setUpdateTime] = useState(Date.now());
  const [hoveredUnit, setHoveredUnit] = useState<string | undefined>(undefined);

  return (
    <TextSegmentationContext.Provider
      value={{ updateTime, setUpdateTime, hoveredUnit, setHoveredUnit }}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          maxHeight: 'calc(100% - 20px)',
          minHeight: 'calc(100% - 20px)',
          overflow: 'scroll',
          mt: '10px',
        }}
      >
        <DndProvider backend={HTML5Backend}>
          <DragLayer />
          <Stack sx={{ height: 'fit-content' }}>
            <UnitsSummary />
            <TextComponent />
          </Stack>
        </DndProvider>
      </Box>
    </TextSegmentationContext.Provider>
  );
}
