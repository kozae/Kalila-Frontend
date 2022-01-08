import { render } from '@testing-library/react';

import EditDescription from './index';

describe('EditDescription', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<EditDescription />);
    expect(baseElement).toBeTruthy();
  });
});
