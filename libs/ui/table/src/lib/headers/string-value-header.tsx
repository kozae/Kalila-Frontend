import styles from './header.module.scss'
import {IconButton, ITextField, ITooltipHostStyles, TextField, TooltipHost} from "@fluentui/react";
import {useId} from '@fluentui/react-hooks';
import {useRef} from "react";


const calloutProps = {gapSpace: 0};
const hostStyles: Partial<ITooltipHostStyles> = {root: {display: 'inline-block'}};

export const StringValueHeader = (props: any) => {
  const tooltip1Id = useId('tooltip1');
  const tooltip2Id = useId('tooltip2');
  const tooltip3Id = useId('tooltip3');
  const refs = {
    sw: useRef<ITextField>(null),
    cn: useRef<ITextField>(null),
    ew: useRef<ITextField>(null)
  };


  return (
    <div className={styles['container']}>
      <div className={styles['label-sort']}>
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
          <TooltipHost
            content="No sort"
            id={tooltip3Id}
            calloutProps={calloutProps}
            styles={hostStyles}
          >
            <IconButton iconProps={{iconName: 'StatusCircleBlock2'}}
                        onClick={() => props.onSort({})}
                        disabled={!(props.activeSort?.OrderBy === props.column.colId)}
                        title="ClearSort"
                        ariaLabel="No sort"/>
          </TooltipHost>
        </div>
      </div>
      <div className={styles['filter']}>
        <TextField
          prefix={'sw'}
          placeholder="Starts with"
          componentRef={refs.sw}
          onChange={
            (e) =>
              props.onFilter({...props.activeFilter, [`${props.column.colId}Sw`]: e.currentTarget.value})
          }
          ariaLabel={`${props.displayName} starts with`}
        />
        <TextField
          prefix={'cn'}
          placeholder="Contains"
          componentRef={refs.cn}
          onChange={
            (e) =>
              props.onFilter({...props.activeFilter, [`${props.column.colId}Cn`]: e.currentTarget.value})
          }
          ariaLabel={`${props.displayName} contains`}
        />
        <TextField
          prefix={'ew'}
          placeholder="Ends with"
          componentRef={refs.ew}
          onChange={
            (e) =>
              props.onFilter({...props.activeFilter, [`${props.column.colId}Ew`]: e.currentTarget.value})
          }
          ariaLabel={`${props.displayName} ends with`}
        />
      </div>
    </div>
  );
};
