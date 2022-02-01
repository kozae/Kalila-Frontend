import React from 'react';
import {initializeIcons, loadTheme} from "@fluentui/react";
import {IEditor, kalilaTheme} from "@frontend/shared-ui";
import {KalilaForm} from "../lib/kalila-form";
import {editorEntrySchema} from '@frontend/util';
import {ManuscriptDescriptionAdmin} from '@frontend/domain';

initializeIcons()

loadTheme(kalilaTheme);
export default {
  title: 'KalilaForm',
  component: KalilaForm,
  argTypes: {onSubmit: {action: 'submitted'}, onCanSubmit: {action: 'can submit'}},
};

const editors: IEditor[] = [
  {
    username: 'mk',
    name: 'Mahmoud Kozae'
  },
  {
    username: 'ds',
    name: 'Dima Sakran'
  }
]

const Template = (args: any) => <div style={{width: '300px'}}><KalilaForm {...args}>
  <button type="submit">Submit</button>
</KalilaForm></div>;

export const CreateManuscript = Template.bind({});

// @ts-ignore
CreateManuscript.args = {
  fields: [
    {
      DocumentName: "ManuscriptDescription",
      FieldName: "siglum",
      FieldDisplay: "Siglum",
      FieldNamePascalCase: "Siglum",
      Readonly: true,
      Hidden: false,
      Unique: true,
      KeyField: true,
      TopField: true,
      Searchable: true,
      EditableInBulk: false,
      KalilaValueType: 0,
      ValueProperties: [],
      InputMode: 0,
      CategoricalAttributeType: ""
    },
    editorEntrySchema
  ],
  editors,
  categoricalAttributes: {},
  initialValues: new ManuscriptDescriptionAdmin(),
  validationSchema: ManuscriptDescriptionAdmin
    .validationSchemaFactory(
      ['mk', 'ds'], {'Siglum': async value => value !== 'P5881'})
}

