import { useStore } from '@nanostores/react'
import * as Menu from '../DropdownMenu'
import {
  deletePalette,
  duplicatePalette,
  paletteIdStore,
  paletteListStore,
  paletteStore,
  renamePalette,
  switchPalette,
} from '../../store/palette'
import { Button, ControlGroup, Input } from '../inputs'
import { ChevronDown } from '../../icons/ChevronDown'
import { Trash } from '../../icons/Trash'
import { Copy } from '../../icons/Copy'
import { Edit } from '../../icons/Edit'
import { Check } from '../../icons/Check'
import { FC, useState } from 'react'

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
        <Button>
          {paletteList[currentIdx].name} <ChevronDown />
        </Button>
      </Menu.Trigger>

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
    </Menu.Root>
  )
}
