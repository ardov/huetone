import { FC, useEffect } from 'react'
import {
  duplicateHue,
  duplicateTone,
  reorderHues,
  reorderTones,
  setColor,
  switchPalette,
} from 'store/palette'
import { useKeyPress } from 'shared/hooks/useKeyPress'
import { useStore } from '@nanostores/react'
import { colorSpaceStore, paletteStore, setPalette } from 'store/palette'
import { selectedStore, setSelected } from 'store/currentPosition'
import { colorToLchString } from 'shared/color'

export const KeyPressHandler: FC = () => {
  const { hex2color } = useStore(colorSpaceStore)
  const palette = useStore(paletteStore)
  const selected = useStore(selectedStore)
  const lPress = useKeyPress('KeyL')
  const cPress = useKeyPress('KeyC')
  const hPress = useKeyPress('KeyH')
  const { hues, tones, mode } = palette

  const incrementC = mode === 'cielch' ? 0.5 : 0.005

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const { key, metaKey, ctrlKey, shiftKey, code } = e
      const metaPressed = metaKey || ctrlKey
      if (!filterInput(e)) return

      // Switch palette
      if (!isNaN(+key)) return switchPalette(+key - 1)

      const noDefault = (func: () => any) => {
        e.preventDefault()
        func()
      }

      if (shiftKey && metaPressed && code === 'KeyC') return copyCurrentLCH()
      if (metaPressed && code === 'KeyC') return copyCurrentHex()
      if (metaPressed && code === 'KeyV') return pasteToCurrent()
      if (code === 'Escape') {
        // @ts-ignore
        return e?.target?.blur()
      }

      // Modify color
      if (lPress || cPress || hPress) {
        e.preventDefault()
        let { l, c, h } = selected.color
        if (key === 'ArrowUp') {
          if (lPress) l += 0.5
          if (cPress) c += incrementC
          if (hPress) h += 0.5
          setPalette(
            setColor(palette, [l, c, h], selected.hueId, selected.toneId)
          )
        }
        if (key === 'ArrowDown') {
          if (lPress) l -= 0.5
          if (cPress) c -= incrementC
          if (hPress) h -= 0.5
          setPalette(
            setColor(palette, [l, c, h], selected.hueId, selected.toneId)
          )
        }
        return
      }

      // Duplicate row or column
      if (metaPressed && shiftKey) {
        if (key === 'ArrowUp') return noDefault(duplicateUp)
        if (key === 'ArrowDown') return noDefault(duplicateDown)
        if (key === 'ArrowLeft') return noDefault(duplicateLeft)
        if (key === 'ArrowRight') return noDefault(duplicateRight)
      }

      // Move row or column
      if (metaPressed) {
        if (key === 'ArrowUp') return noDefault(moveRowUp)
        if (key === 'ArrowDown') return noDefault(moveRowDown)
        if (key === 'ArrowLeft') return noDefault(moveColumnLeft)
        if (key === 'ArrowRight') return noDefault(moveColumnRight)
      }

      // Select color
      if (key === 'ArrowUp') return noDefault(selectUp)
      if (key === 'ArrowDown') return noDefault(selectDown)
      if (key === 'ArrowLeft') return noDefault(selectLeft)
      if (key === 'ArrowRight') return noDefault(selectRight)

      function copyCurrentLCH() {
        e.preventDefault()
        copyToClipboard(colorToLchString(selected.color))
      }
      function copyCurrentHex() {
        e.preventDefault()
        copyToClipboard(selected.color.hex)
      }

      function pasteToCurrent() {
        navigator.clipboard.readText().then(hex => {
          let color = hex2color(hex)
          if (color) {
            let { l, c, h } = color
            setPalette(
              setColor(palette, [l, c, h], selected.hueId, selected.toneId)
            )
          }
        })
      }

      function moveRowUp() {
        if (selected.hueId <= 0) return
        setPalette(reorderHues(palette, selected.hueId, selected.hueId - 1))
        setSelected([selected.hueId - 1, selected.toneId])
      }
      function moveRowDown() {
        if (selected.hueId >= hues.length - 1) return
        setPalette(reorderHues(palette, selected.hueId, selected.hueId + 1))
        setSelected([selected.hueId + 1, selected.toneId])
      }
      function moveColumnLeft() {
        if (selected.toneId <= 0) return
        setPalette(reorderTones(palette, selected.toneId, selected.toneId - 1))
        setSelected([selected.hueId, selected.toneId - 1])
      }
      function moveColumnRight() {
        if (selected.toneId >= tones.length - 1) return
        setPalette(reorderTones(palette, selected.toneId, selected.toneId + 1))
        setSelected([selected.hueId, selected.toneId + 1])
      }

      function duplicateUp() {
        setPalette(duplicateHue(palette, selected.hueId, selected.hueId))
      }
      function duplicateDown() {
        setPalette(duplicateHue(palette, selected.hueId, selected.hueId + 1))
        setSelected([selected.hueId + 1, selected.toneId])
      }
      function duplicateLeft() {
        setPalette(duplicateTone(palette, selected.toneId, selected.toneId))
        setSelected([selected.hueId, selected.toneId])
      }
      function duplicateRight() {
        setPalette(duplicateTone(palette, selected.toneId, selected.toneId + 1))
        setSelected([selected.hueId, selected.toneId + 1])
      }

      function selectUp() {
        if (selected.hueId <= 0) return
        setSelected([selected.hueId - 1, selected.toneId])
      }
      function selectDown() {
        if (selected.hueId >= hues.length - 1) return
        setSelected([selected.hueId + 1, selected.toneId])
      }
      function selectLeft() {
        if (selected.toneId <= 0) return
        setSelected([selected.hueId, selected.toneId - 1])
      }
      function selectRight() {
        if (selected.toneId >= tones.length - 1) return
        setSelected([selected.hueId, selected.toneId + 1])
      }
    }
    window.addEventListener('keydown', handler)
    return () => {
      window.removeEventListener('keydown', handler)
    }
  }, [
    lPress,
    cPress,
    hPress,
    hues.length,
    palette,
    selected,
    tones.length,
    hex2color,
  ])

  return null
}

/** Detects if keyboard input is from editable field */
function filterInput(event: KeyboardEvent) {
  const target = event.target
  if (!target) return true

  // @ts-ignore
  const { tagName, isContentEditable, readOnly } = target
  if (isContentEditable) return false
  // @ts-ignore
  // Skip range inputs
  if (target?.type === 'range') return true
  if (readOnly) return true
  if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tagName)) return false
  // @ts-ignore
  // Skip menu items
  if (target?.getAttribute?.('role') === 'menuitem') return false
  return true
}

function copyToClipboard(str: string) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(str)
  } else {
    // text area method
    let textArea = document.createElement('textarea')
    textArea.value = str
    // make the textarea out of viewport
    textArea.style.position = 'absolute'
    textArea.style.opacity = '0'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    document.execCommand('copy')
    textArea.remove()
  }
}
