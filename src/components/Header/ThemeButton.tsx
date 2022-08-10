import { useColorScheme } from '../../shared/hooks/useColorScheme'
import { Button } from '../inputs'
import { MoonIcon } from '../../shared/icons/Moon'
import { SunIcon } from '../../shared/icons/Sun'

export function ThemeButton() {
  const [scheme, toggle] = useColorScheme()
  return (
    <Button onClick={toggle}>
      {scheme === 'light' ? <MoonIcon /> : <SunIcon />}
    </Button>
  )
}
