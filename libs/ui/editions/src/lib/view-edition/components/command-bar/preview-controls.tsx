import Button from '@mui/material/Button';
import PreviewIcon from '@mui/icons-material/Preview';
import Typography from '@mui/material/Typography';
import { useBehaviorOptions, useBehaviorOptionsMethods } from '../../contexts';

export const PreviewControls = () => {
  const { enableFacsimilePreview } = useBehaviorOptions();
  const { setEnableFacsimilePreview } = useBehaviorOptionsMethods();
  const toggleFacsimilePreview = () => {
    setEnableFacsimilePreview((prev) => !prev);
  };
  return (
    <Button
      onClick={() => toggleFacsimilePreview()}
      startIcon={
        <PreviewIcon
          sx={{ color: enableFacsimilePreview ? 'secondary.main' : '#666666' }}
        />
      }
    >
      <Typography
        color={enableFacsimilePreview ? 'secondary.main' : '#666666'}
        fontSize=".8rem"
      >
        Facsimile
      </Typography>
    </Button>
  );
};
