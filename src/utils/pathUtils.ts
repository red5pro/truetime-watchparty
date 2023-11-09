import { BASENAME } from '../settings/variables'

const determineAssetPath = () => {
  let path = BASENAME.charAt(BASENAME.length - 1) === '/' ? BASENAME : `${BASENAME}/`
  path = path.charAt(0) === '/' ? path : `/${path}`
  return path
}

export const assetBasepath = determineAssetPath()
