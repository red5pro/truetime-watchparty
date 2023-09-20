// https://usehooks-ts.com/react-hook/use-window-size
import { useState } from 'react'

import { useEventListener, useIsomorphicLayoutEffect } from 'usehooks-ts'

interface WindowSize {
  width: number
  height: number
}

export function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: 0,
    height: 0,
  })

  const handleSize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    })
  }

  useEventListener('resize', handleSize)

  // Set size at the first client-side load
  useIsomorphicLayoutEffect(() => {
    handleSize()
  }, [])

  return windowSize
}
