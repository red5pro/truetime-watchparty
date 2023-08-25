import * as portals from 'react-reverse-portal'

interface Props {
  portalNode: any
}

const PublisherPortalStage = (props: Props) => {
  const { portalNode } = props
  return (
    <div id="publisher-portal-stage" style={{ flexGrow: 1, minHeight: 'calc((100vh / 4) - 12px)' }}>
      <portals.OutPortal node={portalNode} />
    </div>
  )
}

export default PublisherPortalStage
