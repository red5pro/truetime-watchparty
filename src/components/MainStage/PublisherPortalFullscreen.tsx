import React from 'react'
import { Box } from '@mui/material'
import * as portals from 'react-reverse-portal'

interface Props {
  portalNode: any
}

const PublisherPortalFullscreen = (props: Props) => {
  const { portalNode } = props
  const divRef = React.useRef()

  // React.useEffect(() => {
  //   if (divRef && divRef.current) {
  //     ;((divRef.current as Node)?.parentNode as HTMLElement).style.height = '100%'
  //   }
  // }, [divRef])

  return (
    <div style={{ display: 'inline-grid' }}>
      <portals.OutPortal node={portalNode} style={{ height: '100%' }} />
    </div>
  )
}

export default PublisherPortalFullscreen
