import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, Dropdown, Typography } from '@epdomains/themey'

import FastForwardSVG from '@app/assets/FastForward.svg'
import PaperPlaneSVG from '@app/assets/PaperPlane.svg'
import TripleDot from '@app/assets/TripleDot.svg'
import { cacheableComponentStyles } from '@app/components/@atoms/CacheableComponent'
import { DisabledButton } from '@app/components/@atoms/DisabledButton'
import { Card } from '@app/components/Card'
import { OutlinedButton } from '@app/components/OutlinedButton'
import { FavouriteButton } from '@app/components/pages/profile/FavouriteButton'
import { useProfileActions } from '@app/hooks/useProfileActions'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { formatExpiry } from '@app/utils/utils'

const Container = styled(Card)(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: ${theme.space['3']};
    & > div:first-of-type {
      margin-bottom: ${theme.space['3']};
    }
  `,
  cacheableComponentStyles,
)

const DropdownWrapper = styled.div(
  ({ theme }) => css`
    /* stylelint-disable */
    & > div > div {
      min-width: ${theme.space['48']};

      button {
        height: ${theme.space['10']};
      }
    }
    /* stylelint-enable */
  `,
)

const ExpiryContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding: ${theme.space['1']};
    & > div:first-of-type {
      color: ${theme.colors.textTertiary};
    }
  `,
)

const TripleDotIcon = styled.div(
  ({ theme }) => css`
    display: block;
    box-sizing: border-box;
    width: ${theme.space['4']};
    height: ${theme.space['4']};
  `,
)

const Row = styled.div(
  ({ theme }) => css`
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: ${theme.space['1.5']};
    flex-gap: ${theme.space['1.5']};
  `,
)

const FullWidthOutlinedButton = styled(OutlinedButton)(
  ({ theme }) => css`
    width: ${theme.space.full};
  `,
)

const InnerButton = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: ${theme.space['2']};
    flex-gap: ${theme.space['2']};
  `,
)

const ButtonIcon = styled.svg(
  ({ theme }) => css`
    display: block;
    width: ${theme.space['4']};
    height: ${theme.space['4']};
  `,
)

const handleSend =
  (showDataInput: ReturnType<typeof useTransactionFlow>['showDataInput'], name: string) => () => {
    showDataInput(`send-name-${name}`, 'SendName', {
      name,
    })
  }

export const DetailSnippet = ({
  name,
  expiryDate,
  canSend,
  canEdit,
  canExtend,
  isCached,
}: {
  name: string
  expiryDate?: Date | null
  canSend: boolean
  canEdit?: boolean
  canExtend?: boolean
  isCached?: boolean
}) => {
  const { t } = useTranslation('common')

  const { showDataInput } = useTransactionFlow()
  const handleExtend = () => {
    showDataInput(`extend-names-${name}`, 'ExtendNames', { names: [name], isSelf: canEdit })
  }

  const { profileActions: actions } = useProfileActions()
  const hasActions = actions && actions.length > 0

  if (!expiryDate && !canSend) return null
  return (
    <Container $isCached={isCached}>
      <Row>
        {expiryDate && (
          <ExpiryContainer data-testid="expiry-data">
            <Typography weight="bold">{t('name.expires')}</Typography>
            <Typography
              weight="bold"
              data-testid="expiry-label"
              data-timestamp={expiryDate.getTime()}
            >
              {formatExpiry(expiryDate)}
            </Typography>
          </ExpiryContainer>
        )}
        <FavouriteButton disabled />
      </Row>
      <Row>
        {expiryDate && (
          <FullWidthOutlinedButton
            size="small"
            shadowless
            disabled={!canExtend}
            variant="transparent"
            data-testid="extend-button"
            onClick={handleExtend}
          >
            <InnerButton>
              <ButtonIcon as={FastForwardSVG} />
              <Typography weight="bold">{t('name.extend')}</Typography>
            </InnerButton>
          </FullWidthOutlinedButton>
        )}
        {canSend && (
          <FullWidthOutlinedButton
            size="small"
            shadowless
            variant="transparent"
            data-testid="send-button"
            onClick={handleSend(showDataInput, name)}
          >
            <InnerButton>
              <ButtonIcon as={PaperPlaneSVG} />
              <Typography weight="bold">{t('name.send')}</Typography>
            </InnerButton>
          </FullWidthOutlinedButton>
        )}
        {hasActions ? (
          <DropdownWrapper>
            <Dropdown
              items={actions.map((action) => ({
                ...action,
                color: action.color || 'text',
              }))}
              menuLabelAlign="flex-end"
              align="right"
              shortThrow
            >
              <Button
                data-testid="profile-actions"
                shadowless
                variant="transparent"
                size="extraSmall"
              >
                <TripleDotIcon as={TripleDot} />
              </Button>
            </Dropdown>
          </DropdownWrapper>
        ) : (
          <DisabledButton shadowless variant="transparent" size="extraSmall">
            <TripleDotIcon as={TripleDot} />
          </DisabledButton>
        )}
      </Row>
    </Container>
  )
}
