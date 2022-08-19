import * as portals from 'react-reverse-portal'

interface Props {
  portalNode: any
}

const PublisherPortalFullscreen = (props: Props) => {
  const { portalNode } = props
  return (
    <div style={{ height: '100%' }}>
      <portals.OutPortal node={portalNode} style={{ height: '100%' }} />
    </div>
  )
}

export default PublisherPortalFullscreen
