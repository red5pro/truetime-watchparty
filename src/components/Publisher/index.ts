export interface PublisherRef {
  shutdown(): any
  toggleCamera?: (on: boolean) => any
  toggleMicrophone?: (on: boolean) => any
}
