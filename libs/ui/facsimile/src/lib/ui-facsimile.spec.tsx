import { render } from '@testing-library/react';

import UiFacsimile from './ui-facsimile';

describe('UiFacsimile', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<UiFacsimile />);
    expect(baseElement).toBeTruthy();
  });
});
