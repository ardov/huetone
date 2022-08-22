import { More } from 'shared/icons/More'
import { EqualizeH } from 'shared/icons/EqualizeH'
import { EqualizeL } from 'shared/icons/EqualizeL'
import { Minimize } from 'shared/icons/Minimize'
import * as Menu from '../DropdownMenu'
import { Button } from '../inputs'
import {
  currentHueToRow,
  currentLuminanceToColumn,
  pushColorsIntoRgb,
} from 'store/palette'

export const ColorActions = () => {
  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Button title="Actions">
          <More />
        </Button>
      </Menu.Trigger>

      <Menu.Portal>
        <Menu.Content align="end" sideOffset={4}>
          <Menu.Item
            onSelect={pushColorsIntoRgb}
            title="Not all LCH colors are displayable in RGB color space. This button will tweak all LCH values to be displayable."
          >
            <span style={{ display: 'flex', gap: 8 }}>
              <Minimize />
              Make colors displayable
            </span>
          </Menu.Item>
          <Menu.Item onSelect={currentHueToRow}>
            <span style={{ display: 'flex', gap: 8 }}>
              <EqualizeH />
              Apply current hue to row
            </span>
          </Menu.Item>
          <Menu.Item onClick={currentLuminanceToColumn}>
            <span style={{ display: 'flex', gap: 8 }}>
              <EqualizeL />
              Apply current luminance to column
            </span>
          </Menu.Item>
        </Menu.Content>
      </Menu.Portal>
    </Menu.Root>
  )
}
