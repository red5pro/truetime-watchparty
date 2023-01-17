export interface PublisherRef {
  shutdown(): any
  send?: (post: PublisherPost) => any
  toggleCamera?: (on: boolean) => any
  toggleMicrophone?: (on: boolean) => any
}

export interface PublisherPost {
  messageType: string
  message: any // object or string
}
