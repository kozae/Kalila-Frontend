import {useMemo, useState} from "react";
import {stringHasValue} from "@frontend/util";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FilterIcon from '@mui/icons-material/Filter';
import Alert from '@mui/material/Alert';


export interface ISiglumSelectionProps {
  sigla: { id: string, Siglum: string }[],
  siglumClass: string,
  siglaContainerClass: string,
  onSelect: (siglum: { id: string, Siglum: string }) => any | Promise<any>
}

export const SiglumSelection = ({sigla, siglumClass, siglaContainerClass, onSelect}: ISiglumSelectionProps) => {
  const [filter, setFilter] = useState('');
  const buttons = useMemo(() => {
    return sigla
      .filter(s => !stringHasValue(filter) || s.Siglum.toLowerCase().startsWith(filter.toLowerCase()))
      .map((s, i) => <div key={i} className={siglumClass}>
        <Button variant="outlined" onClick={() => onSelect(s)}>
          {s.Siglum}
        </Button>
      </div>)
  }, [filter])


  return (
    <>
      <Box sx={{display: 'flex', alignItems: 'flex-end'}}>
        <FilterIcon sx={{color: 'action.active', mr: 1, my: 0.5}}/>
        <TextField value={filter}
                   onChange={e => setFilter(e.currentTarget.value)}
                   id="siglum-filter"
                   label="Siglum starts with"
                   variant="standard"/>
      </Box>
      <div className={siglaContainerClass}>
        {buttons}
      </div>
      {buttons.length === 0 &&
        <Alert sx={{width: 'fit-content', margin: '0.5rem'}} severity="info">no
          manuscripts match
          the current filter</Alert>}
    </>)
}
