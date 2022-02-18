import { render } from '@testing-library/react';

import UiTextEditingTranscription from './ui-text-editing-transcription';

describe('UiTextEditingTranscription', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<UiTextEditingTranscription />);
    expect(baseElement).toBeTruthy();
  });
});
