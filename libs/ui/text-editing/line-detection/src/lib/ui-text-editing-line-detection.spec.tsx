import { render } from '@testing-library/react';

import UiTextEditingLineDetection from './ui-text-editing-line-detection';

describe('UiTextEditingLineDetection', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<UiTextEditingLineDetection />);
    expect(baseElement).toBeTruthy();
  });
});
