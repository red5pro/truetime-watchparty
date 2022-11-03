import { Box, Typography } from '@mui/material'
import React from 'react'
import { VODHLSItem } from '../../models/VODHLSItem'
import { supportsHLS } from '../../utils/hlsUtils'
import { VODHLSPlayerRef } from './VODHLSPlayer'
import useStyles from './VODHLSPlayback.module'

export interface VODHLSThumbnailRef {
  hasItem(item: VODHLSItem): boolean
  redraw(): any
  watch(player: VODHLSPlayerRef): any
}

interface VODHLSThumbnailProps {
  sx: any
  vodHLSItem: VODHLSItem
  onSelect(item: VODHLSItem): any
}

const VODHLSThumbnail = React.forwardRef((props: VODHLSThumbnailProps, ref: React.Ref<VODHLSThumbnailRef>) => {
  const { sx, vodHLSItem, onSelect } = props

  const { classes } = useStyles()

  const canvasRef = React.useRef(null)

  const [target, setTarget] = React.useState<VODHLSPlayerRef>()
  const [video, setVideo] = React.useState<HTMLVideoElement>()
  const [context, setContext] = React.useState<CanvasRenderingContext2D>()

  React.useImperativeHandle(ref, () => ({ hasItem, redraw, watch }))

  React.useEffect(() => {
    if (canvasRef.current && !context) {
      const canvas = canvasRef.current as HTMLCanvasElement
      const ctx = canvas.getContext('2d')
      if (ctx) {
        setContext(ctx)
        ctx.fillStyle = '#000000'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
    }
  }, [])

  React.useEffect(() => {
    if (target) {
      redraw()
    }
  }, [target])

  const hasItem = (item: VODHLSItem) => {
    // TODO: Maybe shallow object compare, instead?
    return vodHLSItem.filename === item.filename
  }

  const watch = (target: VODHLSPlayerRef) => {
    setTarget(target)
  }

  const redraw = () => {
    if (target && !video) {
      if (target.getVideo()) {
        setVideo(target.getVideo())
      }
    }
    if (video && canvasRef.current && context) {
      const canvas = canvasRef.current as HTMLCanvasElement
      const { videoWidth, videoHeight } = video
      const { clientWidth, clientHeight } = canvas
      canvas.width = clientWidth
      canvas.height = clientHeight

      // Mobile Safari doesn't support source + destination?!?!
      if (supportsHLS()) {
        context.drawImage(video, 0, 0, clientWidth, clientHeight)
      } else {
        const xscale = clientWidth / videoWidth
        const yscale = clientHeight / videoHeight
        const xoffset =
          videoWidth > videoHeight
            ? (videoWidth * xscale) / clientWidth
            : videoWidth * ((clientWidth / clientHeight) * 0.5)
        const yoffset =
          videoWidth > videoHeight
            ? videoHeight * ((clientHeight / clientWidth) * 0.5)
            : (videoHeight * yscale) / clientHeight
        const sx = -xoffset * 0.5
        const sy = -yoffset * 0.5
        const swidth = videoWidth + xoffset
        const sheight = videoHeight + yoffset

        context.drawImage(video, sx, sy, swidth, sheight, 0, 0, clientWidth, clientHeight)
      }
      // console.log(`REDRAW:: ${vodHLSItem.name} at ${videoWidth}x${videoHeight}`)
    }
  }

  return (
    <Box sx={sx} className={classes.thumbnailContainer} onClick={() => onSelect(vodHLSItem)}>
      <canvas ref={canvasRef} className={classes.thumbnail}></canvas>
      <Typography className={classes.thumbnailLabel}>{vodHLSItem.name}</Typography>
    </Box>
  )
})

VODHLSThumbnail.displayName = 'VODHLSThumbnail'
export default VODHLSThumbnail
