import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Stack, Typography } from '@mui/material';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.log('Caught in error boundary:', error, errorInfo);
  }

  public override render() {
    if (this.state.hasError) {
      return (
        <Stack
          position="fixed"
          width="100vw"
          height="100vh"
          top={0}
          left={0}
          alignItems="center"
          justifyContent="center"
        >
          <img src="/err.svg" width="50%" height="auto" alt="error" />
          <Typography p="1rem" color="warning.dark" variant="h2">
            Unexpected Error Happened! Please Report.
          </Typography>
        </Stack>
      );
    }

    return this.props.children;
  }
}
