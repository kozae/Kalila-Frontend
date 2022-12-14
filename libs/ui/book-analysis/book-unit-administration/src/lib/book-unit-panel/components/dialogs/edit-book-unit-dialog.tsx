import Modal from '@mui/material/Modal';
import { DialogHeading } from '@frontend/shared-ui';
import Typography from '@mui/material/Typography';
import React, { useCallback, useMemo, useState } from 'react';
import Portal from '@mui/material/Portal';
import Stack from '@mui/material/Stack';
import { SxProps } from '@mui/system/styleFunctionSx';
import { BookUnit } from '@frontend/domain';
import { Field, FieldArray, Form, Formik } from 'formik';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import { stringHasValue } from '@frontend/util';
import { isEqual } from 'lodash';
import { useUIOptions } from '../../contexts/ui-options.context';
import {
  useAuxiliarySurfacesData,
  useAuxiliarySurfacesMethods,
} from '../../contexts/auxiliary-surfaces.context';
import { useData, useDataMethods } from '../../contexts/data.context';
import { BookUnitValidation } from '../../helpers/validation-schema';

const style: SxProps = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '400px',
  height: 'fit-content',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: '10px',
};

export const EditBookUnitDialog = () => {
  const { accessMode } = useUIOptions();
  const { editBookUnitDialogIsOpen } = useAuxiliarySurfacesData();
  const { setEditBookUnitDialogIsOpen } = useAuxiliarySurfacesMethods();
  const { selectedBookUnit } = useData();
  const { validate, updateBookUnit } = useDataMethods();
  const [value, setValue] = useState<BookUnit | null>(null);
  const [errors, setErrors] = useState<string[] | null>(null);

  const originalValue = useMemo(
    () => selectedBookUnit ?? new BookUnit(),
    [selectedBookUnit]
  );

  const onClose = () => {
    setValue(null);
    setErrors(null);
    setEditBookUnitDialogIsOpen(false);
  };

  const onValidate = useCallback(
    async (values: BookUnit) => {
      setValue(null);
      setErrors(null);
      const errors = [];
      const variantIsChanged = values.Variant !== originalValue.Variant;
      if (stringHasValue(values.Variant) && variantIsChanged) {
        const valid =
          validate &&
          (await validate({
            OrderEq: values.Order,
            VariantEq: values.Variant,
          }));
        if (!valid) {
          setErrors([
            'Same order and variant exist. The unit cannot be updated',
          ]);
          return;
        }
      }
      const titleIsChanged = values.Title !== originalValue.Title;
      if (
        titleIsChanged &&
        validate &&
        !(await validate({ TitleSw: values.Title, TitleEw: values.Title }))
      ) {
        errors.push(
          'A unit with the same title exists. The unit can still be updated '
        );
      }
      const orderIsChanged = !isEqual(values.Order, originalValue.Order);
      if (
        orderIsChanged &&
        validate &&
        !(await validate({ OrderEq: values.Order }))
      ) {
        errors.push(
          'A unit with the same order exists. The unit can still be created; this will cause a shift in unit numbers '
        );
      }

      if (errors.length !== 0) {
        setErrors(errors);
      }
      const hasChanges =
        variantIsChanged ||
        titleIsChanged ||
        orderIsChanged ||
        !isEqual(values.FrameTags, originalValue.FrameTags) ||
        !isEqual(values.Topics, originalValue.Topics) ||
        !isEqual(values.Motifs, originalValue.Motifs);
      if (hasChanges) {
        setValue(values);
      }
    },
    [originalValue, validate]
  );

  const onSave = useCallback(async () => {
    if (value && updateBookUnit) {
      try {
        const variantIsChanged = value.Variant !== originalValue.Variant;
        const titleIsChanged = value.Title !== originalValue.Title;
        const orderIsChanged = !isEqual(value.Order, originalValue.Order);
        const updateStructure =
          variantIsChanged || titleIsChanged || orderIsChanged
            ? {
                Title: titleIsChanged ? value.Title : undefined,
                Variant: variantIsChanged ? value.Variant : undefined,
                NewOrder: orderIsChanged ? value.Order : [],
                OldOrder: orderIsChanged ? originalValue.Order : [],
              }
            : undefined;

        const frameTagsChanged = !isEqual(
          value.FrameTags,
          originalValue.FrameTags
        );
        const topicsChanged = !isEqual(value.Topics, originalValue.Topics);
        const motifsChanged = !isEqual(value.Motifs, originalValue.Motifs);

        const updateFrame =
          frameTagsChanged || topicsChanged || motifsChanged
            ? {
                FrameTags: frameTagsChanged ? value.FrameTags : undefined,
                Topics: topicsChanged ? value.Topics : undefined,
                Motifs: motifsChanged ? value.Motifs : undefined,
              }
            : undefined;

        await updateBookUnit(
          { Ids: [originalValue.Id] },
          updateStructure,
          updateFrame
        );
        onClose();
      } catch (err) {
        console.log(err);
      }
    }
  }, [value, originalValue, updateBookUnit]);

  return (
    <Portal>
      <Modal open={editBookUnitDialogIsOpen} onClose={onClose}>
        <Stack alignItems="center" sx={style}>
          <DialogHeading onDismiss={onClose}>
            <Typography color="white" variant="h5">
              Edit Book Unit
            </Typography>
          </DialogHeading>
          <Stack width="350px" mt="10px" flexGrow={1}>
            <Formik
              validationSchema={BookUnitValidation}
              initialValues={originalValue}
              validateOnBlur={true}
              validateOnMount={true}
              onSubmit={onValidate}
            >
              {({ values, isValid, touched }) => (
                <Form
                  style={{
                    height: '100%',
                    width: '100%',
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Stack
                    flexGrow={1}
                    height="100%"
                    width="100%"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Stack width="100%" spacing={0.5}>
                      <Typography variant="body1">Title:</Typography>
                      <Field width="100%" name="Title">
                        {({
                          field, // { name, value, onChange, onBlur }
                          form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                          meta,
                        }: any) => (
                          <div>
                            <input
                              style={{ width: '100%' }}
                              type="text"
                              {...field}
                            />
                            {meta.touched && meta.error && (
                              <Typography color="warning.main" variant="body1">
                                {meta.error}
                              </Typography>
                            )}
                          </div>
                        )}
                      </Field>
                      {accessMode === 'admin' && (
                        <>
                          <Typography variant="body1">Order:</Typography>
                          <FieldArray
                            name="Order"
                            render={(arrayHelpers) => (
                              <div>
                                {values.Order && values.Order.length > 0 ? (
                                  values.Order.map((frame, index) => (
                                    <div key={index}>
                                      <Field
                                        type="number"
                                        min="1"
                                        max="999"
                                        step="1"
                                        name={`Order.${index}`}
                                      />
                                      <button
                                        type="button"
                                        onClick={() =>
                                          arrayHelpers.remove(index)
                                        } // remove a friend from the list
                                      >
                                        -
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          arrayHelpers.insert(index + 1, '')
                                        } // insert an empty string at a position
                                      >
                                        +
                                      </button>
                                    </div>
                                  ))
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => arrayHelpers.push('')}
                                  >
                                    Add a frame
                                  </button>
                                )}
                              </div>
                            )}
                          />
                          <Typography variant="body1">Frame Tags:</Typography>
                          <FieldArray
                            name="FrameTags"
                            render={(arrayHelpers) => (
                              <div>
                                {values.FrameTags &&
                                values.FrameTags.length > 0 ? (
                                  values.FrameTags.map((frame, index) => (
                                    <div key={index}>
                                      <Field name={`FrameTags.${index}`} />
                                      <button
                                        type="button"
                                        onClick={() =>
                                          arrayHelpers.remove(index)
                                        } // remove a friend from the list
                                      >
                                        -
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          arrayHelpers.insert(index + 1, '')
                                        } // insert an empty string at a position
                                      >
                                        +
                                      </button>
                                    </div>
                                  ))
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => arrayHelpers.push('')}
                                  >
                                    Add a frame
                                  </button>
                                )}
                              </div>
                            )}
                          />
                          <Typography variant="body1">Variant:</Typography>
                          <Field name="Variant">
                            {({
                              field, // { name, value, onChange, onBlur }
                              form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                              meta,
                            }: any) => (
                              <div>
                                <input type="text" {...field} />
                                {meta.touched && meta.error && (
                                  <div className="error">{meta.error}</div>
                                )}
                              </div>
                            )}
                          </Field>
                          <Stack direction="row">
                            <Field type="checkbox" name="Divider" />
                            &nbsp;
                            <Typography variant="body1">Divider</Typography>
                          </Stack>
                        </>
                      )}
                      <Typography variant="body1">Topics:</Typography>
                      <FieldArray
                        name="Topics"
                        render={(arrayHelpers) => (
                          <div>
                            {values.Topics && values.Topics.length > 0 ? (
                              values.Topics.map((frame, index) => (
                                <div key={index}>
                                  <Field name={`Topics.${index}`} />
                                  <button
                                    type="button"
                                    onClick={() => arrayHelpers.remove(index)} // remove a friend from the list
                                  >
                                    -
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      arrayHelpers.insert(index + 1, '')
                                    } // insert an empty string at a position
                                  >
                                    +
                                  </button>
                                </div>
                              ))
                            ) : (
                              <button
                                type="button"
                                onClick={() => arrayHelpers.push('')}
                              >
                                Add a topic
                              </button>
                            )}
                          </div>
                        )}
                      />
                      <Typography variant="body1">Motifs:</Typography>
                      <FieldArray
                        name="Motifs"
                        render={(arrayHelpers) => (
                          <div>
                            {values.Motifs && values.Motifs.length > 0 ? (
                              values.Motifs.map((frame, index) => (
                                <div key={index}>
                                  <Field name={`Motifs.${index}`} />
                                  <button
                                    type="button"
                                    onClick={() => arrayHelpers.remove(index)} // remove a friend from the list
                                  >
                                    -
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      arrayHelpers.insert(index + 1, '')
                                    } // insert an empty string at a position
                                  >
                                    +
                                  </button>
                                </div>
                              ))
                            ) : (
                              <button
                                type="button"
                                onClick={() => arrayHelpers.push('')}
                              >
                                Add a motif
                              </button>
                            )}
                          </div>
                        )}
                      />
                    </Stack>
                    <div>
                      <Button
                        color="secondary"
                        disabled={
                          !isValid || !Object.values(touched).some((t) => t)
                        }
                        type="submit"
                      >
                        Validate
                      </Button>
                    </div>
                  </Stack>
                </Form>
              )}
            </Formik>
          </Stack>
          {errors != null && (
            <Stack p="10px" spacing={0.5}>
              {errors.map((err, i) => (
                <Alert key={i} severity={value != null ? 'info' : 'error'}>
                  <Typography color="warning" variant="body1">
                    {err}
                  </Typography>
                </Alert>
              ))}
            </Stack>
          )}
          {value != null && (
            <Stack mt="10px">
              <Button onClick={onSave}>
                {errors == null ? 'Update' : 'Update anyway'}
              </Button>
            </Stack>
          )}
        </Stack>
      </Modal>
    </Portal>
  );
};
