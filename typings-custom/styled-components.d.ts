import { lightTheme } from '@epdomains/themey'
import 'styled-components'

type Theme = typeof lightTheme

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}
