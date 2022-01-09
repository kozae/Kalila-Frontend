import { render } from '@testing-library/react';

import Tool from './index';

describe('Tool', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Tool />);
    expect(baseElement).toBeTruthy();
  });
});
