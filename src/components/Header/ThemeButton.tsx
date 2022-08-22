import { useColorScheme } from 'shared/hooks/useColorScheme'
import { MoonIcon } from 'shared/icons/Moon'
import { SunIcon } from 'shared/icons/Sun'
import { Button } from '../inputs'

export function ThemeButton() {
  const [scheme, toggle] = useColorScheme()
  return (
    <Button onClick={toggle}>
      {scheme === 'light' ? <MoonIcon /> : <SunIcon />}
    </Button>
  )
}
