import React, { FC, useState } from 'react'
import { paletteToHex } from '../palette'
import { Palette } from '../types'

export const ExportButton: FC<{ palette: Palette }> = ({ palette }) => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <button onClick={() => setVisible(v => !v)}>
        {visible ? 'Hide' : 'Export'}
      </button>
      {visible && <pre>{JSON.stringify(paletteToHex(palette), null, 2)}</pre>}
    </>
  )
}
