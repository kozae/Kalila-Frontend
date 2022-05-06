import { render } from '@testing-library/react';

import UiFacsimileHighlighter from './ui-facsimile-highlighter';

describe('UiFacsimileHighlighter', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<UiFacsimileHighlighter />);
    expect(baseElement).toBeTruthy();
  });
});
