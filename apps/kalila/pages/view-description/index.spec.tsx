import { render } from '@testing-library/react';

import ViewDescription from './index';

describe('ViewDescription', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ViewDescription />);
    expect(baseElement).toBeTruthy();
  });
});
