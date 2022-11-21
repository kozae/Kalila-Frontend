import { Story, Meta } from '@storybook/react';
import { UiFacsimileGenerator } from './ui-facsimile-generator';

export default {
  component: UiFacsimileGenerator,
  title: 'UiFacsimileGenerator',
} as Meta;

const Template: Story = (args) => <UiFacsimileGenerator {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
