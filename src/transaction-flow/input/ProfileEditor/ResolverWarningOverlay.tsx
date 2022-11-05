import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, Typography } from '@epdomains/themey'

import DismissDialogButton from '@app/components/@atoms/DismissDialogButton/DismissDialogButton'
import { makeTransactionItem } from '@app/transaction-flow/transaction'
import { TransactionDialogPassthrough } from '@app/transaction-flow/types'

const Container = styled.div(
  ({ theme }) => css`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      41.95% 17.64% at 50.14% 50.08%,
      #fff 0%,
      rgba(255, 255, 255, 0.81) 100%
    );
    backdrop-filter: blur(8px);
    border-radius: ${theme.radii.extraLarge};
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
  `,
)

const Content = styled.div(
  ({ theme }) => css`
    width: 90%;
    max-width: ${theme.space['72']};
    display: flex;
    flex-direction: column;
    gap: ${theme.space['9']};
  `,
)

const Message = styled.div(
  () => css`
    display: flex;
    flex-direction: column;
    align-items: center;
  `,
)

const Title = styled(Typography)(
  () => css`
    text-align: center;
  `,
)

const Subtitle = styled(Typography)(
  () => css`
    text-align: center;
  `,
)

const DismissButtonWrapper = styled.div(
  () => css`
    position: absolute;
    top: 0;
    right: 0;
  `,
)
type SettingsDict = {
  [key: string]: {
    handler?: () => void
    href?: string
    as?: 'a'
    dismissable: boolean
  }
}

type Props = {
  name: string
  resumable?: boolean
  hasOldRegistry?: boolean
  hasMigratedProfile?: boolean
  hasNoResolver?: boolean
  latestResolver: string
  oldResolver: string
} & TransactionDialogPassthrough

const ResolverWarningOverlay = ({
  name,
  hasOldRegistry = false,
  resumable = false,
  hasMigratedProfile = false,
  hasNoResolver = false,
  latestResolver,
  oldResolver,
  dispatch,
  onDismiss,
}: Props) => {
  const { t } = useTranslation('transactionFlow')

  const handleResumeTransaction = () => {
    dispatch({ name: 'resumeFlow', key: `edit-profile-flow-${name}` })
  }

  const handleUpdateResolver = () => {
    dispatch({
      name: 'setTransactions',
      payload: [
        makeTransactionItem('updateResolver', {
          name,
          contract: 'registry',
          resolver: latestResolver,
          oldResolver,
        }),
      ],
    })
    dispatch({ name: 'setFlowStage', payload: 'transaction' })
  }

  const handleTransferProfile = () => {
    dispatch({
      name: 'showDataInput',
      payload: {
        input: {
          name: 'TransferProfile',
          data: { name },
        },
      },
      key: `edit-profile-${name}`,
    })
  }

  /* eslint-disable no-nested-ternary */
  const settingsKey = hasOldRegistry
    ? 'oldRegistry'
    : resumable
    ? 'resumable'
    : hasMigratedProfile
    ? 'migrate'
    : hasNoResolver
    ? 'noResolver'
    : 'default'

  const settingsDict: SettingsDict = {
    resumable: {
      handler: handleResumeTransaction,
      dismissable: true,
    },
    migrate: {
      handler: handleUpdateResolver,
      dismissable: true,
    },
    noResolver: {
      handler: handleUpdateResolver,
      dismissable: false,
    },
    oldRegistry: {
      dismissable: false,
      as: 'a',
      href: `https://app.ens.domains/name/${name}`,
    },
    default: {
      handler: handleTransferProfile,
      dismissable: true,
    },
  }
  const { dismissable, handler, as, href } = settingsDict[settingsKey]
  const title = t(`input.profileEditor.warningOverlay.${settingsKey}.title`)
  const subtitle = t(`input.profileEditor.warningOverlay.${settingsKey}.subtitle`)
  const action = t(`input.profileEditor.warningOverlay.${settingsKey}.action`)

  const handleUpgrade = () => {
    handler?.()
  }

  return (
    <Container data-testid="warning-overlay">
      {dismissable && (
        <DismissButtonWrapper data-testid="warning-overlay-dismiss">
          <DismissDialogButton onClick={onDismiss} />
        </DismissButtonWrapper>
      )}
      <Content>
        <Message>
          <Title variant="extraLarge">{title}</Title>
          <Subtitle weight="medium" color="textSecondary">
            {subtitle}
          </Subtitle>
        </Message>
        <Button as={as} href={href} target="_blank" onClick={handleUpgrade} shadowless>
          {action}
        </Button>
      </Content>
    </Container>
  )
}

export default ResolverWarningOverlay
