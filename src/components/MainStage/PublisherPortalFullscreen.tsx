import React from 'react'
import * as portals from 'react-reverse-portal'

interface Props {
  portalNode: any
}

const PublisherPortalFullscreen = (props: Props) => {
  const { portalNode } = props
  return (
    <div style={{ display: 'inline-flex', marginTop: '0!important' }}>
      <portals.OutPortal node={portalNode} style={{ height: '100%' }} />
    </div>
  )
}

export default PublisherPortalFullscreen
