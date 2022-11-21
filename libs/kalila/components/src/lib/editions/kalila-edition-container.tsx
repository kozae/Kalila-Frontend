import dynamic from 'next/dynamic';
import {
  EditionPage,
  getCells,
  getRows,
  importEditionStore,
  EditionPageProvider,
  IEditionPageAppOptions,
  IEditionPageAppOptionMutators,
  IRealTimeUpdateProps,
} from '@frontend/ui/editions';
import { IEdition } from '@frontend/domain';
import { useState } from 'react';

export interface IKalilaEditionContainerProps
  extends IEditionPageAppOptions,
    IEditionPageAppOptionMutators {
  data: IEdition;
  realTime: IRealTimeUpdateProps;
}

export const KalilaEditionContainer = dynamic<IKalilaEditionContainerProps>({
  loader: async () => {
    const { EditionStore } = await importEditionStore();
    return ({ data, ...props }) => {
      const [edition, setEdition] = useState(EditionStore.load(data));
      const [rows, setRows] = useState(getRows(edition));
      const [cells, setCells] = useState(getCells(edition));
      return (
        <EditionPageProvider
          {...{
            edition,
            rows,
            cells,
            setCells,
            setRows,
            setEdition,
            ...props,
          }}
        >
          <EditionPage />
        </EditionPageProvider>
      );
    };
  },
  loading: () => <h1>Loading...</h1>,
  ssr: false,
});
