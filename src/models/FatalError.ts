export interface FatalError {
  data?: any
  status: number | string
  statusText: string
  title?: string
  closeLabel?: string
  onClose(): any
}
