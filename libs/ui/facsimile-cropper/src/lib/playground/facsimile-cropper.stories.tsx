import { Story, Meta } from '@storybook/react';
import {
  FacsimileCropperPlayground,
  IFacsimileCropperProps,
} from './facsimile-cropper-playground';

export default {
  component: FacsimileCropperPlayground,
  title: 'UiFacsimileCropper',
} as Meta;

const Template: Story<IFacsimileCropperProps> = (args) => (
  <FacsimileCropperPlayground {...args} />
);

export const M486_14 = Template.bind({});
M486_14.args = {
  fileName: 'M486_14',
};

export const P3471_11 = Template.bind({});
P3471_11.args = {
  fileName: 'P3471_11',
};
