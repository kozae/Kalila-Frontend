import { render } from '@testing-library/react';

import UiTextEditingLayoutAnalysis from './ui-text-editing-layout-analysis';

describe('UiTextEditingLayoutAnalysis', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<UiTextEditingLayoutAnalysis />);
    expect(baseElement).toBeTruthy();
  });
});
