import { render } from '@testing-library/react';

import UiTextEditingTextSegmentation from './ui-text-editing-text-segmentation';

describe('UiTextEditingTextSegmentation', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<UiTextEditingTextSegmentation />);
    expect(baseElement).toBeTruthy();
  });
});
