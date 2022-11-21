import { ICommonFieldProps } from './common-field-props';
import { editionProgressOptions, IDataEntrySchema } from '@frontend/util';
import { IEditor } from '@frontend/shared-ui';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Theme, useTheme } from '@mui/material/styles';

import { Box, Chip } from '@mui/material';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name: string, personName: readonly string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

interface ISelectManyProps extends ICommonFieldProps {
  field: IDataEntrySchema;
  categoricalAttributes: Record<string, string[]>;
  editors: IEditor[];
  setFieldValue: any;
  labelId: string;
}

export const SelectMany = ({
  field,
  categoricalAttributes,
  editors,
  setFieldValue,
  labelId,
  formControlProps,
  commonInputProps,
  value,
  inputLabel,
  helperText,
}: ISelectManyProps) => {
  const theme = useTheme();
  const editorOptions: any[] = editors.map((v) => ({
    key: v.username,
    text: v.name,
  }));

  const selectFieldOptions: { key: any; text: any }[] =
    field.FieldNamePascalCase === 'Editor'
      ? editorOptions
      : field.FieldNamePascalCase === 'EditionProgress'
      ? editionProgressOptions.map((v) => ({ key: v, text: v }))
      : categoricalAttributes[field.CategoricalAttributeType ?? '___']?.map(
          (v: string) => ({
            key: v.trim(),
            text: v,
          })
        ) ?? [];
  const selectFieldProps = {
    ...commonInputProps,
    labelId,
    value,
    onChange: (event: SelectChangeEvent) => {
      setFieldValue(field.FieldNamePascalCase, event.target.value);
    },
  };
  return (
    <FormControl {...formControlProps} variant="standard">
      {inputLabel}
      <Select
        {...selectFieldProps}
        renderValue={(selected: any) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((value: any) => (
              <Chip key={value} label={value} />
            ))}
          </Box>
        )}
        multiple
        MenuProps={MenuProps}
      >
        {selectFieldOptions.map(({ key, text }, i) => (
          <MenuItem key={i} value={key} style={getStyles(key, text, theme)}>
            {text}
          </MenuItem>
        ))}
      </Select>
      {helperText}
    </FormControl>
  );
};
