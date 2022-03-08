import { render } from '@testing-library/react';

import UiTextEditingShared from './ui-text-editing-shared';

describe('UiTextEditingShared', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<UiTextEditingShared />);
    expect(baseElement).toBeTruthy();
  });
});
