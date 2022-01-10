import { render } from '@testing-library/react';

import BookAnalysis from './index';

describe('BookAnalysis', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BookAnalysis />);
    expect(baseElement).toBeTruthy();
  });
});
