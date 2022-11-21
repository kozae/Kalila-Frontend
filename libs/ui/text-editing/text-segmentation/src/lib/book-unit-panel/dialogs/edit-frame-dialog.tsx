import Modal from '@mui/material/Modal';
import { DialogHeading } from '@frontend/shared-ui';
import Typography from '@mui/material/Typography';
import React, { useCallback, useContext, useMemo, useState } from 'react';
import Portal from '@mui/material/Portal';
import Stack from '@mui/material/Stack';
import { SxProps } from '@mui/system/styleFunctionSx';
import { BookUnit, IBookUnit } from '@frontend/domain';
import { BookUnitPanelContext } from '../book-unit-panel.context';
import { Field, FieldArray, Form, Formik } from 'formik';
import { BookUnitValidation } from '../helpers/validation-schema';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import { stringHasValue } from '@frontend/util';
import { countBookUnits, validate } from '../helpers/validation-request';
import { isEqual } from 'lodash';
import {
  updateStructureRequest,
  updateFrameRequest,
} from '../helpers/update-request';

const style: SxProps = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '400px',
  height: 'fit-content',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: '10px',
};

export const EditFrameDialog = () => {
  const { editFrameDialogIsOpen, setEditFrameDialogIsOpen, refetchUnits } =
    useContext(BookUnitPanelContext);
  const [filter, setFilter] = useState<{
    FrameMatches?: number[];
    TagContains?: string;
  } | null>(null);
  const [errors, setErrors] = useState<string[] | null>(null);
  const onClose = () => {
    setFilter(null);
    setErrors(null);
    setEditFrameDialogIsOpen(false);
  };

  const onSubmitFilter = useCallback(
    async (values: { FrameMatches?: number[]; TagContains?: string }) => {
      setErrors(null);
      const affected = await countBookUnits({
        FrameMatches: values?.FrameMatches,
        FrameTagsCn: values?.TagContains,
      });
      console.log(affected);
      const formattedFilter = `[${values?.FrameMatches?.map(
        (i) => i + '.'
      ).join('')}
                ${values?.TagContains}]`;
      setErrors([
        `Updating with the filter ${formattedFilter} affects ${affected} documents, does this seem correct?`,
      ]);
      setFilter(values);
    },
    [filter]
  );

  const onSubmitUpdate = useCallback(
    async (value: BookUnit) => {
      if (value && refetchUnits) {
        try {
          const orderChanged = value.Order && value.Order.length !== 0;
          const frameTagsChanged =
            value.FrameTags && value.FrameTags.length !== 0;
          const topicsChanged = value.Topics && value.Topics.length !== 0;
          const motifsChanged = value.Motifs && value.Motifs.length !== 0;

          if (
            orderChanged ||
            frameTagsChanged ||
            topicsChanged ||
            motifsChanged
          ) {
            await updateFrameRequest(
              {
                FrameMatches: filter?.FrameMatches,
                FrameTagsCn: filter?.TagContains,
              },
              {
                Order: orderChanged ? value.Order : undefined,
                FrameTags: frameTagsChanged ? value.FrameTags : undefined,
                Topics: topicsChanged ? value.Topics : undefined,
                Motifs: motifsChanged ? value.Motifs : undefined,
              }
            );
          }

          await refetchUnits();
          onClose();
        } catch (err) {
          console.log(err);
        }
      }
    },
    [filter]
  );

  return (
    <Portal>
      <Modal open={editFrameDialogIsOpen} onClose={onClose}>
        <Stack alignItems="center" sx={style}>
          <DialogHeading onDismiss={onClose}>
            <Typography color="white" variant="h5">
              Edit Units by a Frame Filter
            </Typography>
          </DialogHeading>
          <Stack width="350px" mt="10px" flexGrow={1}>
            <Formik
              initialValues={{ FrameMatches: [], TagContains: '' }}
              validateOnBlur={true}
              validateOnMount={true}
              onSubmit={onSubmitFilter}
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
                      <Typography variant="body1">
                        Match Frame Order:
                      </Typography>
                      <FieldArray
                        name="FrameMatches"
                        render={(arrayHelpers) => (
                          <div>
                            {values.FrameMatches &&
                            values.FrameMatches.length > 0 ? (
                              values.FrameMatches.map((frame, index) => (
                                <div key={index}>
                                  <Field
                                    type="number"
                                    min="1"
                                    step="1"
                                    name={`FrameMatches.${index}`}
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
                      <Typography variant="body1">Match Tag:</Typography>
                      <Field width="100%" name="TagContains">
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
                      <div>
                        <Button
                          color="secondary"
                          disabled={
                            !isValid || !Object.values(touched).some((t) => t)
                          }
                          type="submit"
                        >
                          {filter === null ? 'Validate' : 'Revalidate'}
                        </Button>
                      </div>
                    </Stack>
                  </Stack>
                </Form>
              )}
            </Formik>
            {filter !== null &&
              (filter.FrameMatches?.length !== 0 ||
                filter.TagContains?.length) !== 0 && (
                <Formik
                  initialValues={new BookUnit()}
                  onSubmit={onSubmitUpdate}
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
                                    Add a motif
                                  </button>
                                )}
                              </div>
                            )}
                          />
                        </Stack>
                        {errors != null && (
                          <Stack p="10px" spacing={0.5}>
                            {errors.map((err, i) => (
                              <Alert key={i} severity="warning">
                                <Typography color="warning" variant="body1">
                                  {err}
                                </Typography>
                              </Alert>
                            ))}
                          </Stack>
                        )}
                        <div>
                          <Button
                            color="secondary"
                            disabled={
                              !isValid || !Object.values(touched).some((t) => t)
                            }
                            type="submit"
                          >
                            Apply update for{' '}
                            {filter?.FrameMatches?.map((i) => `${i}.`)}{' '}
                            {filter?.TagContains}
                          </Button>
                        </div>
                      </Stack>
                    </Form>
                  )}
                </Formik>
              )}
          </Stack>
        </Stack>
      </Modal>
    </Portal>
  );
};
