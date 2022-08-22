import { FC, useState } from 'react'
import { useStore } from '@nanostores/react'
import {
  deletePalette,
  duplicatePalette,
  paletteIdStore,
  paletteListStore,
  paletteStore,
  renamePalette,
  switchPalette,
} from 'store/palette'
import { ChevronDown } from 'shared/icons/ChevronDown'
import { Trash } from 'shared/icons/Trash'
import { Copy } from 'shared/icons/Copy'
import { Edit } from 'shared/icons/Edit'
import { Check } from 'shared/icons/Check'
import * as Menu from '../DropdownMenu'
import { Button, ControlGroup, Input } from '../inputs'

export const PaletteSelect = () => {
  const [renameState, setRenameState] = useState(false)
  const palette = useStore(paletteStore)

  if (renameState) {
    return (
      <RenameInput
        name={palette.name}
        onChange={name => {
          renamePalette(name)
          setRenameState(false)
        }}
      />
    )
  }

  return (
    <ControlGroup>
      <PaletteSelectComponent />
      <Button title="Rename palette" onClick={() => setRenameState(true)}>
        <Edit />
      </Button>
    </ControlGroup>
  )
}

export const RenameInput: FC<{
  name: string
  onChange: (name: string) => void
}> = ({ name, onChange }) => {
  const [value, setValue] = useState(name)
  return (
    <ControlGroup>
      <Input
        name="Palette name"
        autoFocus
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyPress={e => e.key === 'Enter' && onChange(value)}
        onBlur={() => onChange(value)}
      />
      <Button title="Save changes" onClick={() => onChange(value)}>
        <Check />
      </Button>
    </ControlGroup>
  )
}

const PaletteSelectComponent = () => {
  const paletteList = useStore(paletteListStore)
  const currentIdx = useStore(paletteIdStore)
  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Button
          title={paletteList[currentIdx].name}
          style={{ width: 200, justifyContent: 'space-between' }}
        >
          <span
            style={{
              minWidth: 0,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}
          >
            {paletteList[currentIdx].name}
          </span>
          <ChevronDown />
        </Button>
      </Menu.Trigger>

      <Menu.Portal>
        <Menu.Content align="start" sideOffset={4}>
          <Menu.Label>Palettes</Menu.Label>
          {paletteList.map((p, i) => (
            <Menu.Item
              key={i}
              selected={i === currentIdx}
              onSelect={() => switchPalette(i)}
            >
              {p.name}
              {!p.isPreset && (
                <span style={{ display: 'flex', gap: 8 }}>
                  <Copy
                    onClick={e => {
                      e.preventDefault()
                      duplicatePalette(i)
                    }}
                  />
                  <Trash
                    onClick={e => {
                      e.preventDefault()
                      deletePalette(i)
                    }}
                  />
                </span>
              )}
            </Menu.Item>
          ))}
        </Menu.Content>
      </Menu.Portal>
    </Menu.Root>
  )
}
