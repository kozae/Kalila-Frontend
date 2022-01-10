import { render } from '@testing-library/react';

import ImageCycleAnalysis from './index';

describe('ImageCycleAnalysis', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ImageCycleAnalysis />);
    expect(baseElement).toBeTruthy();
  });
});
