import * as portals from 'react-reverse-portal'

interface Props {
  portalNode: any
}

const PublisherPortalStage = (props: Props) => {
  const { portalNode } = props
  return (
    <div style={{ flexGrow: 1 }}>
      <portals.OutPortal node={portalNode} />
    </div>
  )
}

export default PublisherPortalStage
