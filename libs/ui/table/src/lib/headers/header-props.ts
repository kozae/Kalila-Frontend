export interface IHeaderProps {
  Id: string;
  displayName: string;
  exactMatch?: boolean;
  activeSort: any;
  activeFilter: any;
  onSort: (sort: any) => Promise<void>;
  onFilter: (filter: any) => Promise<void>;
}
