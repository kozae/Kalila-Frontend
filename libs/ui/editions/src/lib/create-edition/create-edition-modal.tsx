import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { CreateEditionStepper } from './create-edition-stepper';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import dynamic from 'next/dynamic';
import Button from '@mui/material/Button';

export interface ICreateEditionModalProps {
  open: boolean;
  handleClose: () => void;
}

export const EditionStore = dynamic(
  {
    loader: async () => {
      const wasmModule = await import('../store');
      return () => (
        <Button onClick={() => wasmModule.greet('Mahmoud')}>Greet</Button>
      );
    },
  },
  { ssr: false }
);

export const CreateEditionModal = ({
  open,
  handleClose,
}: ICreateEditionModalProps) => {
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xl" fullWidth>
      <DialogTitle>Create Edition</DialogTitle>
      <DialogContent>
        <DndProvider backend={HTML5Backend}>
          <CreateEditionStepper />
        </DndProvider>
      </DialogContent>
    </Dialog>
  );
};
