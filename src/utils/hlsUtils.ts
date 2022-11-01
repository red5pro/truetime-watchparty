export const supportsHLS = () => {
  const el = document.createElement('video')
  return (
    el.canPlayType('application/vnd.apple.mpegURL').length > 0 ||
    el.canPlayType('application/x-mpegURL').length > 0 ||
    el.canPlayType('audio/mpegurl').length > 0 ||
    el.canPlayType('audio/x-mpegurl').length > 0
  )
}
