import styles from './header.module.scss'
import {IconButton, ITextField, ITooltipHostStyles, TextField, TooltipHost} from "@fluentui/react";
import {useId} from '@fluentui/react-hooks';
import {useRef, useEffect, useState} from "react";


const calloutProps = {gapSpace: 0};
const hostStyles: Partial<ITooltipHostStyles> = {root: {display: 'inline-block'}};

function useStringFilterFieldState(accessor: string, activeFilter: Record<string, any>, onFilter: (newFilter: Record<string, any>) => void) {

  const [value, setValue] = useState(activeFilter[accessor] ?? '');
  const ref = useRef<ITextField>(null)
  useEffect(() => {
    setValue(activeFilter[accessor] ?? '')
    if (ref.current) {
      ref.current.focus()
    }
  }, [activeFilter[accessor]])

  useEffect(() => {
    const active = activeFilter[accessor] ?? '';
    if (value !== active) {
      onFilter({...activeFilter, [accessor]: value})
    }
  }, [value])

  const onChange = (e: any) => setValue(e.currentTarget.value)

  return [value, ref, onChange]

}

const StringFilterFieldWithPrefix = ({prefix, placeholder, ariaLabel, accessor, activeFilter, onFilter}: any) => {
  const [value, ref, onChange] = useStringFilterFieldState(accessor, activeFilter, onFilter);
  return (
    <TextField
      prefix={prefix}
      placeholder={placeholder}
      value={value}
      componentRef={ref}
      onChange={onChange}
      ariaLabel={ariaLabel}
    />
  )

}

const StringFilterFieldWithIcon = ({icon, placeholder, ariaLabel, accessor, activeFilter, onFilter}: any) => {
  const [value, ref, onChange] = useStringFilterFieldState(accessor, activeFilter, onFilter);
  return (
    <TextField
      iconProps={{iconName: icon}}
      placeholder={placeholder}
      value={value}
      componentRef={ref}
      onChange={onChange}
      ariaLabel={ariaLabel}
    />
  )

}

export const StringValueHeader = (props: any) => {
  const tooltip1Id = useId('tooltip1');
  const tooltip2Id = useId('tooltip2');

  const filterProps =
    {
      icon: 'Filter',
      accessor: `${props.column.colId}Cn`,
      placeholder: 'Filter',
      ariaLabel: `${props.displayName} contains`,
      activeFilter: props.activeFilter,
      onFilter: props.onFilter
    }


  return (
    <div className={styles['container']}>
      <div  className={styles['label-sort']}>
        <div className={styles['label']}>{props.displayName}</div>
        <div className={styles['sort']}>
          <TooltipHost
            content="Sort ascending"
            id={tooltip1Id}
            calloutProps={calloutProps}
            styles={hostStyles}
          >
            <IconButton
              iconProps={{iconName: 'Ascending'}}
              title="Ascending"
              ariaLabel="Ascending"
              onClick={() => props.onSort({OrderBy: props.column.colId})}
              checked={props.activeSort?.OrderBy === props.column.colId && props.activeSort?.SortDirection !== 'desc'}/>
          </TooltipHost>
          <TooltipHost
            content="Sort descending"
            id={tooltip2Id}
            calloutProps={calloutProps}
            styles={hostStyles}
          >
            <IconButton
              iconProps={{iconName: 'Descending'}}
              title="Descending"
              ariaLabel="Descending"
              onClick={() => props.onSort({OrderBy: props.column.colId, SortDirection: 'desc'})}
              checked={props.activeSort?.OrderBy === props.column.colId && props.activeSort?.SortDirection === 'desc'}/>
          </TooltipHost>
        </div>
      </div>
      <StringFilterFieldWithIcon {...filterProps} />
    </div>
  );
};
