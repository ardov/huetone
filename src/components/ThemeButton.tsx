import { useColorScheme } from '../hooks/useColorScheme'
import { Button } from './inputs'
import { MoonIcon } from '../icons/Moon'
import { SunIcon } from '../icons/Sun'

export function ThemeButton() {
  const [scheme, toggle] = useColorScheme()
  return (
    <Button onClick={toggle}>
      {scheme === 'light' ? <MoonIcon /> : <SunIcon />}
    </Button>
  )
}
