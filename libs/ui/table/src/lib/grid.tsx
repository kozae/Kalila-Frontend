import React from 'react';

export interface IGridProps {
  loading: boolean;
}

const loadingOverlays =
  '<span class="ag-overlay-loading-center">loading...</span>';
const noRowsOverlays = `<span style="padding: 10px; border: 2px solid #444; background: white;">No data</span>`;

export const Grid: React.FC<IGridProps> = ({ loading }) => {
  return (
    <div
      className="ag-theme-kalila"
      style={{ height: 'fit-content', width: '100%' }}
    ></div>
  );
};
