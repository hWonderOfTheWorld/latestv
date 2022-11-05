import styled, { css } from 'styled-components'

import { Button } from '@epdomains/themey'

export const DisabledButton = styled(Button)(
  () => css`
    filter: grayscale(100%);
    opacity: 0.5;
    pointer-events: none;
  `,
)
