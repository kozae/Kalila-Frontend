import {DefaultButton, MessageBar, TextField} from "@fluentui/react";
import {useMemo, useState} from "react";
import {stringHasValue} from "@frontend/util";

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
        <DefaultButton onClick={() => onSelect(s)} styles={{root: {width: '100px'}}} text={s.Siglum}/>
      </div>)
  }, [filter])


  return (
    <>  <TextField value={filter} onChange={e => setFilter(e.currentTarget.value)}
                   iconProps={{iconName: 'Filter'}}
                   underlined
                   label="Siglum starts with:"/>
      <div className={siglaContainerClass}>
        {buttons}
      </div>
      {buttons.length === 0 &&
        <MessageBar styles={{root: {width: 'fit-content', margin: '0.5rem'}}} messageBarType={2}>no
          manuscripts match
          the current filter</MessageBar>}
    </>)
}
