import { render } from '@testing-library/react';

import UiTextEditingPagesSummary from './ui-text-editing-pages-summary';

describe('UiTextEditingPagesSummary', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<UiTextEditingPagesSummary />);
    expect(baseElement).toBeTruthy();
  });
});
