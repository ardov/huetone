import { useEffect, useState } from 'react'

// Source: https://usehooks.com/useKeyPress/
export function useKeyPress(targetKey: string): boolean {
  // State for keeping track of whether key is pressed
  const [keyPressed, setKeyPressed] = useState(false)
  // If pressed key is our target key then set to true
  function downHandler({ code, metaKey }: KeyboardEvent): void {
    if (code === targetKey && !metaKey) {
      // Mac never fires keyup event if CMD is pressed with a key
      // so to prevent key from staying pressed we will igonore this kydown event
      if (metaKey) return
      setKeyPressed(true)
    }
  }
  // If released key is our target key then set to false
  const upHandler = ({ code }: KeyboardEvent): void => {
    if (code === targetKey) {
      setKeyPressed(false)
    }
  }
  // Add event listeners
  useEffect(() => {
    window.addEventListener('keydown', downHandler)
    window.addEventListener('keyup', upHandler)
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', downHandler)
      window.removeEventListener('keyup', upHandler)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty array ensures that effect is only run on mount and unmount
  return keyPressed
}
