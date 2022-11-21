import Modal from '@mui/material/Modal';
import { DialogHeading } from '@frontend/shared-ui';
import Typography from '@mui/material/Typography';
import React, { useCallback, useContext, useState } from 'react';
import Portal from '@mui/material/Portal';
import Stack from '@mui/material/Stack';
import { SxProps } from '@mui/system/styleFunctionSx';
import { BookUnit } from '@frontend/domain';
import ObjectID from 'bson-objectid';
import { BookUnitPanelContext } from '../book-unit-panel.context';
import { Formik, Form, Field, FieldArray } from 'formik';
import Button from '@mui/material/Button';
import { BookUnitValidation } from '../helpers/validation-schema';
import { stringHasValue } from '@frontend/util';
import { validate } from '../helpers/validation-request';
import Alert from '@mui/material/Alert';
import { createRequest } from '../helpers/create-request';

const style: SxProps = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '400px',
  minHeight: '300px',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: '10px',
};

export const CreateBookUnitDialog = () => {
  const {
    chapter,
    createUnitDialogOpen,
    setCreateUnitDialogOpen,
    refetchUnits,
  } = useContext(BookUnitPanelContext);

  const [value, setValue] = useState<BookUnit | null>(null);
  const [errors, setErrors] = useState<string[] | null>(null);
  const onClose = () => {
    setValue(null);
    setErrors(null);
    setCreateUnitDialogOpen(false);
  };

  const onValidate = async (values: BookUnit) => {
    const errors = [];

    if (stringHasValue(values.Variant)) {
      const valid = await validate({
        OrderEq: values.Order,
        VariantEq: values.Variant,
      });
      if (!valid) {
        setErrors(['Same order and variant exist. The unit cannot be created']);
        return;
      }
    }
    if (!(await validate({ TitleSw: values.Title, TitleEw: values.Title }))) {
      errors.push(
        'A unit with the same title exists. The unit can still be created '
      );
    }

    if (!(await validate({ OrderEq: values.Order }))) {
      errors.push(
        'A unit with the same order exists. The unit can still be created; this will cause a shift in unit numbers '
      );
    }

    if (errors.length !== 0) {
      setErrors(errors);
    }

    setValue(values);
  };

  const onSave = useCallback(async () => {
    if (value && refetchUnits) {
      try {
        await createRequest({
          Id: ObjectID().toString(),
          Title: value.Title,
          Order: value.Order,
          Variant: stringHasValue(value.Variant) ? value.Variant : undefined,
          Divider: value.Divider,
          FrameTags: value.FrameTags,
          Editor: 'mk',
          EditionProgress: 'in work',
        });
        await refetchUnits();
        onClose();
      } catch (err) {
        console.log(err);
      }
    }
  }, [value]);

  return (
    <Portal>
      <Modal open={createUnitDialogOpen} onClose={onClose}>
        <Stack alignItems="center" sx={style}>
          <DialogHeading onDismiss={onClose}>
            <Typography color="white" variant="h5">
              Create Unit in "{chapter?.name}"
            </Typography>
          </DialogHeading>
          <Stack width="350px" mt="10px" flexGrow={1}>
            <Formik
              validationSchema={BookUnitValidation}
              initialValues={
                new BookUnit(
                  ObjectID().toString(),
                  [0],
                  false,
                  '',
                  undefined,
                  []
                )
              }
              validateOnBlur={true}
              validateOnMount={true}
              onSubmit={onValidate}
            >
              {({ values, isValid }) => (
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
                    justifyContent="space-between"
                    alignItems="center"
                    width="100%"
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
                            {values.FrameTags && values.FrameTags.length > 0 ? (
                              values.FrameTags.map((frame, index) => (
                                <div key={index}>
                                  <Field name={`FrameTags.${index}`} />
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
                    </Stack>
                    <div>
                      <Button
                        color="secondary"
                        disabled={!isValid}
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
                <Alert key={i} severity={value != null ? 'warning' : 'error'}>
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
                {errors == null ? 'Save' : 'Save anyway'}
              </Button>
            </Stack>
          )}
        </Stack>
      </Modal>
    </Portal>
  );
};
