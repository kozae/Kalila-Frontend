import { render } from '@testing-library/react';

import UiAdministration from './ui-administration';

describe('UiAdministration', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<UiAdministration />);
    expect(baseElement).toBeTruthy();
  });
});
