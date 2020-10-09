export interface Entity {
  key: string,
  label: string,
  tableColumns: string[],
  numberTypeColumns: string[],
  initialFilter: any
}
