import styled, { css } from 'styled-components'

import { mq } from '@epdomains/themey'

export const ContentGrid = styled.div<{ $spacing?: string }>(
  ({ theme, $spacing = '270px 2fr' }) => css`
    flex-grow: 1;
    width: 100%;
    overflow: hidden;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(6, min-content);
    gap: ${theme.space['5']};
    align-self: center;

    ${mq.md.min(css`
      grid-template-columns: ${$spacing};
    `)}
  `,
)
