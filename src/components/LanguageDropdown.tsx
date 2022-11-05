import ISO6391 from 'iso-639-1'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Dropdown, mq } from '@epdomains/themey'

import { useBreakpoint } from '@app/utils/BreakpointProvider'

const MobileInnerDropdownButton = styled.div<{ $large: boolean }>(
  ({ theme, $large }) => css`
    width: fit;
    padding: ${theme.space['0.5']} ${theme.space['1.5']};
    display: block;
    font-size: ${theme.fontSizes.label};
    align-items: center;
    transition: none;
    ${$large &&
    mq.sm.min(css`
      width: ${theme.space['12']};
      padding: 0;
      display: flex;
      align-items: flex-start;
    `)}
  `,
)

export const LanugageDropdown = ({ invert }: { invert?: boolean }) => {
  const breakpoints = useBreakpoint()
  const router = useRouter()
  const { i18n } = useTranslation()

  const isLarge: boolean = router.asPath === '/' && !!breakpoints.sm

  const formatName = (language: string) =>
    isLarge ? ISO6391.getNativeName(language) : language.toUpperCase()

  return i18n.options && router.isReady ? (
    <Dropdown
      direction={invert ? 'up' : 'down'}
      inner
      shortThrow={!isLarge}
      chevron={isLarge}
      size={isLarge ? 'medium' : 'small'}
      items={(i18n.options.supportedLngs || [])
        .filter((lang: string) => lang && lang !== i18n.resolvedLanguage && lang !== 'cimode')
        .map((lang: string) => ({
          label: formatName(lang),
          onClick: () => i18n.changeLanguage(lang),
        }))}
      menuLabelAlign={isLarge ? 'flex-start' : 'center'}
      label={
        <MobileInnerDropdownButton $large={isLarge}>
          {formatName(i18n.language || 'en')}
        </MobileInnerDropdownButton>
      }
    />
  ) : null
}
