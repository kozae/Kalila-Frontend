import { render } from '@testing-library/react';

import UiBookAnalysisBookUnitAdministration from './ui-book-analysis-book-unit-administration';

describe('UiBookAnalysisBookUnitAdministration', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<UiBookAnalysisBookUnitAdministration />);
    expect(baseElement).toBeTruthy();
  });
});
