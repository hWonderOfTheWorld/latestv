import Link from 'next/link'
import { ComponentProps } from 'react'
import styled, { css } from 'styled-components'
import type { UrlObject } from 'url'

import { Typography } from '@epdomains/themey'

import OutlinkSVG from '@app/assets/Outlink.svg'

export const StyledAnchor = styled.a(
  ({ theme }) => css`
    padding-right: ${theme.space['4']};
    position: relative;
    color: ${theme.colors.accent};
    cursor: pointer;
  `,
)

const OutlinkIcon = styled.div(
  ({ theme }) => css`
    position: absolute;
    top: ${theme.space['0']};
    right: ${theme.space['0']};
    width: ${theme.space['3.5']};
    height: ${theme.space['3.5']};
    opacity: ${theme.opacity[50]};
  `,
)

export const OutlinkTypography = styled(Typography)(
  () => css`
    display: inline-block;
  `,
)

export const Outlink = ({
  href,
  children,
  ...props
}: Omit<ComponentProps<'a'>, 'href' | 'target' | 'rel'> &
  ComponentProps<typeof StyledAnchor> & {
    href: string | UrlObject
  }) => {
  return (
    <Link href={href} passHref>
      <StyledAnchor {...props} rel="noreferrer noopener" target="_blank">
        <OutlinkTypography variant="small" weight="bold">
          {children}
        </OutlinkTypography>
        <OutlinkIcon as={OutlinkSVG} />
      </StyledAnchor>
    </Link>
  )
}
