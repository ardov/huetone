import React, { FC, useState } from 'react'
import styled from 'styled-components'
import { paletteToHex } from '../palette'
import { Palette } from '../types'

export const ExportButton: FC<{ palette: Palette }> = ({ palette }) => {
  const [visible, setVisible] = useState(false)
  return (
    <Wrapper>
      <button onClick={() => setVisible(v => !v)}>
        {visible ? 'Hide' : 'Export'}
      </button>
      {visible && (
        <textarea
          onKeyDown={e => e.stopPropagation()}
          value={JSON.stringify(paletteToHex(palette), null, 2)}
        />
      )}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`
