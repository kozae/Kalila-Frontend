import { render } from '@testing-library/react';

import ManuscriptDescription from './index';

describe('ManuscriptDescription', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ManuscriptDescription />);
    expect(baseElement).toBeTruthy();
  });
});
