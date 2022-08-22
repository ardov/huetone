import * as Menu from '../DropdownMenu'
import { Button } from '../inputs'
import { Settings } from 'shared/icons/Settings'
import {
  chartSettingsStore,
  toggleShowColors,
  toggleShowP3,
  toggleShowRec2020,
} from 'store/chartSettings'
import { useStore } from '@nanostores/react'
import { paletteStore, toggleColorSpace } from 'store/palette'

export const ChartSettings = () => {
  const { showColors, showP3, showRec2020 } = useStore(chartSettingsStore)
  const { mode } = useStore(paletteStore)
  const nextMode = mode === 'cielch' ? 'OKLch' : 'CIELch'
  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Button title="Chart settings">
          <Settings />
        </Button>
      </Menu.Trigger>

      <Menu.Portal>
        <Menu.Content align="center" sideOffset={4}>
          <Menu.Item onSelect={toggleColorSpace}>
            Use {nextMode} color model
          </Menu.Item>
          <Menu.Item onSelect={toggleShowColors}>
            {showColors ? 'Hide' : 'Show'} colors on charts
          </Menu.Item>
          <Menu.Item onSelect={toggleShowP3}>
            {showP3 ? 'Hide' : 'Show'} P3 color space
          </Menu.Item>
          <Menu.Item onSelect={toggleShowRec2020}>
            {showRec2020 ? 'Hide' : 'Show'} Rec. 2020 color space
          </Menu.Item>
        </Menu.Content>
      </Menu.Portal>
    </Menu.Root>
  )
}
