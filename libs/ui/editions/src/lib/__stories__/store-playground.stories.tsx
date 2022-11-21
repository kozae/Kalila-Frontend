import { Story, Meta } from '@storybook/react';
import { StorePlayground } from './store-playground';

export default {
  component: StorePlayground,
  title: 'StorePlayground',
} as Meta;

const Template: Story<any> = (args) => <StorePlayground {...args} />;

export const Story1 = Template.bind({});
