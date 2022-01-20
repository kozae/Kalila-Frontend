import styles from './header.module.scss'
import {IconButton, ITooltipHostStyles, TextField, TooltipHost} from "@fluentui/react";
import {useId} from '@fluentui/react-hooks';


const calloutProps = {gapSpace: 0};
const hostStyles: Partial<ITooltipHostStyles> = {root: {display: 'inline-block'}};

export const StringValueHeader = (props: any) => {
  const tooltip1Id = useId('tooltip1');
  const tooltip2Id = useId('tooltip2');
  const tooltip3Id = useId('tooltip3');
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
          ariaLabel="Example text field with https:// prefix"
        />
        <TextField
          prefix={'cn'}
          placeholder="Contains"
          ariaLabel="Example text field with https:// prefix"
        />
        <TextField
          prefix={'ew'}
          placeholder="Ends with"
          ariaLabel="Example text field with https:// prefix"
        />
      </div>
    </div>
  );
};
