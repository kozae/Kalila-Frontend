import Stack from "@mui/material/Stack";
import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { TextField } from "@mui/material";

export interface INameAndSaveEditionProps {
  editionName: string;
  setEditionName: Dispatch<SetStateAction<string>>;
}

export const NameAndSaveEdition = ({ editionName, setEditionName }: INameAndSaveEditionProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEditionName(event.target.value);
  };
  // Todo: Add validations, unique and no spaces
  return <Stack alignItems="center" justifyContent="center" sx={{ width: "100%", height: "100%" }}>
    <TextField
      id="outlined-name"
      label="Name"
      value={editionName}
      onChange={handleChange}
    />
  </Stack>;
};
