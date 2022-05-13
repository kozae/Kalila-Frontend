import { Story, Meta } from '@storybook/react';
import {
  FacsimileHighlighter,
  UiFacsimileHighlighterProps,
} from './facsimile-highlighter';

export default {
  component: FacsimileHighlighter,
  title: 'UiFacsimileHighlighter',
} as Meta;

const Template: Story<UiFacsimileHighlighterProps> = (args) => (
  <FacsimileHighlighter {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
