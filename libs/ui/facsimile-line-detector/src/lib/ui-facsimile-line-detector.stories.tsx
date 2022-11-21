import { Story, Meta } from '@storybook/react';
import { UiFacsimileLineDetector } from './ui-facsimile-line-detector';

export default {
  component: UiFacsimileLineDetector,
  title: 'UiFacsimileLineDetector',
} as Meta;

const Template: Story = (args) => {
  return <UiFacsimileLineDetector {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {};
