import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Typography, mq } from '@epdomains/themey'

import { CacheableComponent } from '@app/components/@atoms/CacheableComponent'
import supportedAddresses from '@app/constants/supportedAddresses.json'
import supportedProfileItems from '@app/constants/supportedProfileItems.json'
import supportedTexts from '@app/constants/supportedTexts.json'

import { AddressProfileButton, OtherProfileButton, SocialProfileButton } from './ProfileButton'

const ProfileInfoBox = styled(CacheableComponent)(({ theme }) => [
  css`
    padding: ${theme.space['4']} ${theme.space['4']};
    background-color: ${theme.colors.background};
    border: ${theme.space.px} solid ${theme.colors.borderTertiary};
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.02);
    border-radius: ${theme.radii['2xLarge']};
  `,
  mq.md.min(css`
    padding: ${theme.space['8']} ${theme.space['8']};
  `),
])

const Stack = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-flow: row wrap;
    flex-gap: ${theme.space['2']};
    gap: ${theme.space['2']};
    margin-top: ${theme.space['2']};
  `,
)

const SectionTitle = styled(Typography)(({ theme }) => [
  css`
    margin-left: ${theme.space['2']};
  `,
  mq.md.min(css`
    margin-left: ${theme.space['3']};
  `),
])

const ProfileSection = ({
  condition,
  label,
  array,
  button,
  supported,
  type,
}: {
  condition: any
  label: string
  array: Array<Record<'key' | 'value', string>>
  button: any
  supported?: Array<string>
  type?: 'address' | 'text'
}) => {
  const { t } = useTranslation('profile')
  const Button = button
  const supportedArray = supported
    ? array.filter((x) => supported.includes(x.key.toLowerCase()))
    : array
  const unsupportedArray = supported
    ? array.filter((x) => !supported.includes(x.key.toLowerCase())).map((x) => ({ ...x, type }))
    : []

  return condition ? (
    <div>
      <SectionTitle color="textSecondary" weight="bold" size="base">
        {t(label)}
      </SectionTitle>
      <Stack>
        {supportedArray.map((item: { key: string; value: string; type?: 'text' | 'address' }) => (
          <Button {...{ ...item, iconKey: item.key }} />
        ))}
        {unsupportedArray.length > 0 &&
          unsupportedArray.map(
            (item: { key: string; value: string; type?: 'text' | 'address' }) => (
              <OtherProfileButton {...{ ...item, iconKey: item.key }} />
            ),
          )}
      </Stack>
    </div>
  ) : null
}

const RecordsStack = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    flex-gap: ${theme.space['4']};
    gap: ${theme.space['4']};
  `,
)

export const ProfileDetails = ({
  textRecords = [],
  addresses = [],
  isCached,
}: {
  textRecords: Array<Record<'key' | 'value', string>>
  addresses: Array<Record<'key' | 'value', string>>
  isCached?: boolean
}) => {
  const otherRecords = [
    ...textRecords
      .filter(
        (x) =>
          !supportedTexts.includes(x.key.toLowerCase()) &&
          !supportedProfileItems.includes(x.key.toLowerCase()),
      )
      .map((x) => ({ ...x, type: 'text' })),
  ]

  if (!textRecords.length && !addresses.length) return null

  return (
    <ProfileInfoBox $isCached={isCached}>
      <RecordsStack>
        <ProfileSection
          label="accounts"
          condition={
            textRecords &&
            textRecords.filter((x) => supportedTexts.includes(x.key.toLowerCase())).length > 0
          }
          array={textRecords}
          button={SocialProfileButton}
        />
        <ProfileSection
          label="addresses"
          type="address"
          condition={addresses && addresses.length > 0}
          supported={supportedAddresses}
          array={addresses}
          button={AddressProfileButton}
        />
        <ProfileSection
          label="otherRecords"
          condition={otherRecords && otherRecords.length > 0}
          array={otherRecords}
          button={OtherProfileButton}
        />
      </RecordsStack>
    </ProfileInfoBox>
  )
}
