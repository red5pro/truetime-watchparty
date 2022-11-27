export interface Column {
  id: string
  label: string
  minWidth?: number
  align?: 'right'
  format?: (value: number) => string
}

export enum SectionValueSelected {
  CREATE_GUEST = 3,
  CREATE_CONFERENCE = 0,
  CREATE_SERIE = 1,
}
