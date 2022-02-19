import { render } from '@testing-library/react';

import UiTextEditingWorkspace from './ui-text-editing-workspace';

describe('UiTextEditingWorkspace', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<UiTextEditingWorkspace />);
    expect(baseElement).toBeTruthy();
  });
});
