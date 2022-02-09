import { IColumnProps } from '../column-props';
import { AgGridColumn } from 'ag-grid-react';

export const CodicologyColumns = ({ headerComponentParams }: IColumnProps) => {
  return (
    <>
      <AgGridColumn headerName="Dating">
        <AgGridColumn
          headerComponent={'stringValueHeader'}
          headerComponentParams={headerComponentParams}
          headerName="Accuracy"
          field="DatingAccuracy"
        />
        <AgGridColumn
          headerComponent={'numberValueHeader'}
          headerComponentParams={headerComponentParams}
          headerName="GregorianCentury"
          field="DatingGregorianCentury"
        />
        <AgGridColumn
          headerComponent={'numberValueHeader'}
          headerComponentParams={headerComponentParams}
          headerName="HijriCentury"
          field="DatingHijriCentury"
        />
        <AgGridColumn
          headerComponent={'numberValueHeader'}
          headerComponentParams={headerComponentParams}
          headerName="GregorianYear"
          field="DatingGregorianYear"
        />
        <AgGridColumn
          headerComponent={'stringValueHeader'}
          headerComponentParams={headerComponentParams}
          headerName="HijriYear"
          field="DatingHijriYear"
        />
        <AgGridColumn
          headerComponent={'stringValueHeader'}
          headerComponentParams={headerComponentParams}
          headerName="HijriDate"
          field="DatingHijriDate"
        />
        <AgGridColumn headerName="Commentary" field="DatingCommentary" />
      </AgGridColumn>
    </>
  );
};
