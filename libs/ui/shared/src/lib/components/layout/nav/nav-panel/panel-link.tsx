import Link from 'next/link';
import MuiLink from '@mui/material/Link';
import { SxProps } from '@mui/system/styleFunctionSx';
import { useLargeScreenMediaQuery } from '@frontend/shared-ui';
export const PanelLink = ({
  linkRef,
  text,
  sx,
}: {
  linkRef: string;
  text: string;
  sx?: SxProps;
}) => {
  const isLargeScreen = useLargeScreenMediaQuery();
  return (
    <Link href={'/' + linkRef}>
      <MuiLink
        sx={
          sx
            ? { cursor: 'pointer', ...sx }
            : { cursor: 'pointer', fontWeight: 'bold' }
        }
        fontSize={isLargeScreen ? '1rem' : '0.6rem'}
        color="secondary.main"
        underline="hover"
      >
        {text}
      </MuiLink>
    </Link>
  );
};
