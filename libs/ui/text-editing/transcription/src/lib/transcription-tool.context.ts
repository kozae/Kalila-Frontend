import { createContext } from 'react';

export interface ITranscriptionToolContext {
  mode: 'main' | 'other';
  setMode: (mode: 'main' | 'other') => void;
}

export const TranscriptionToolContext =
  createContext<ITranscriptionToolContext>({
    mode: 'main',
    setMode: (mode) => {},
  });
