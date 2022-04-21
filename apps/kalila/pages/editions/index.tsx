import { useBoolean, useNavbarMessage, withTransition } from "@frontend/shared-ui";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Portal from "@mui/material/Portal";
import { CreateEditionModal } from "@frontend/ui/editions";
import Head from "next/head";
import React from "react";
import Link from "next/link";


export function Editions() {
  const [createDialogIsOpen, { setTrue: openCreateDialog, setFalse: closeCreateDialog }] = useBoolean(false);
  useNavbarMessage(["Select Edition", undefined]);

  return (
    <>
      <Head>
        <title>Kalila Editions</title>
      </Head>
      <Stack direction="row" spacing={.5} sx={{ mt: "10px" }}>
        <Button onClick={openCreateDialog} variant="contained" disableElevation color="secondary">Create
          edition from chapter...</Button>
        <Button onClick={openCreateDialog} variant="contained" disableElevation color="secondary">Create
          edition from unit group...</Button>
        <Portal>
          <CreateEditionModal open={createDialogIsOpen} handleClose={closeCreateDialog} />
        </Portal>
        <Link href="/editions/test">
          <a> Test Edition </a>
        </Link>
      </Stack>
    </>

  );
}

export default withTransition(Editions, {});
