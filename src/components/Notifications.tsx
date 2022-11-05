import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, Toast } from '@epdomains/themey'

import useCallbackOnTransaction, {
  UpdateCallback,
} from '@app/hooks/transactions/useCallbackOnTransaction'
import { useChainName } from '@app/hooks/useChainName'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { makeEtherscanLink } from '@app/utils/utils'

type Notification = {
  title: string
  description?: string
  children?: React.ReactNode
}

const ButtonContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: stretch;
    gap: ${theme.space['2']};
  `,
)

export const Notifications = () => {
  const { t } = useTranslation()
  const breakpoints = useBreakpoint()

  const chainName = useChainName()

  const [open, setOpen] = useState(false)

  const queryClient = useQueryClient()
  const { resumeTransactionFlow, getResumable } = useTransactionFlow()

  const [notificationQueue, setNotificationQueue] = useState<Notification[]>([])
  const currentNotification = notificationQueue[0]

  const updateCallback = useCallback<UpdateCallback>(
    ({ action, key, status, hash }) => {
      if (status === 'pending') return
      const resumable = key && getResumable(key)
      const item = {
        title: t(`transaction.status.${status}.notifyTitle`),
        description: t(`transaction.status.${status}.notifyMessage`, {
          action: t(`transaction.description.${action}`),
        }),
        children: resumable ? (
          <ButtonContainer>
            <a target="_blank" href={makeEtherscanLink(hash, chainName)} rel="noreferrer">
              <Button shadowless size="small" variant="secondary">
                {t('transaction.viewEtherscan')}
              </Button>
            </a>
            <Button
              shadowless
              size="small"
              variant="primary"
              onClick={() => resumeTransactionFlow(key)}
            >
              Continue
            </Button>
          </ButtonContainer>
        ) : (
          <a target="_blank" href={makeEtherscanLink(hash, chainName)} rel="noreferrer">
            <Button shadowless size="small" variant="secondary">
              {t('transaction.viewEtherscan')}
            </Button>
          </a>
        ),
      }

      setNotificationQueue((queue) => [...queue, item])
    },
    [chainName, getResumable, resumeTransactionFlow, t],
  )

  useCallbackOnTransaction(updateCallback)

  useEffect(() => {
    if (currentNotification) {
      setOpen(true)
    }
  }, [currentNotification])

  useEffect(() => {
    if (currentNotification) {
      queryClient.invalidateQueries()
      queryClient.resetQueries({ exact: false, queryKey: ['getSubnames'] })
    }
  }, [currentNotification, queryClient])

  return (
    <Toast
      onClose={() => {
        setOpen(false)
        setTimeout(
          () => setNotificationQueue((prev) => [...prev.filter((x) => x !== currentNotification)]),
          300,
        )
      }}
      open={open}
      variant={breakpoints.md ? 'desktop' : 'touch'}
      {...currentNotification}
    />
  )
}
