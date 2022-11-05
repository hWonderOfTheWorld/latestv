import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Helper, Typography } from '@epdomains/themey'

import { CacheableComponent } from '@app/components/@atoms/CacheableComponent'
import { Spacer } from '@app/components/@atoms/Spacer'
import { TrafficLight } from '@app/components/TrafficLight'
import { useGetWrapperData } from '@app/hooks/useGetWrapperData'

const FusesContainer = styled(CacheableComponent)(
  () => css`
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    padding: 20px 25px;
  `,
)

const FusesRow = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: space-between;

    &:not(:last-child) {
      margin-bottom: 10px;
      padding-bottom: 10px;
      border-bottom: ${theme.borderWidths.px} ${theme.borderStyles.solid}
        ${theme.colors.borderTertiary};
    }
  `,
)

const Fuses = () => {
  const { t } = useTranslation('profile', { keyPrefix: 'details.tabs.advanced' })
  const router = useRouter()
  const { name } = router.query
  const { wrapperData, isCachedData } = useGetWrapperData((name as string) || '')

  return !wrapperData ? (
    <Typography>{t('fuses.callToAction')}</Typography>
  ) : (
    <FusesContainer $isCached={isCachedData}>
      {!wrapperData.fuseObj.PARENT_CANNOT_CONTROL && (
        <>
          <Helper type="warning">{t('fuses.permissions.warning')}</Helper>
          <Spacer $height="8" />
        </>
      )}
      <div>
        <Typography weight="bold" color="textTertiary">
          {t('fuses.permissions.label')}
        </Typography>
        <Spacer $height="5" />
        <div>
          <FusesRow>
            <Typography color="textSecondary" weight="bold">
              {t('fuses.permissions.CAN_DO_EVERYTHING')}
            </Typography>
            <TrafficLight
              $go={wrapperData.fuseObj.CAN_DO_EVERYTHING}
              data-testid="first-traffic-light"
            />
          </FusesRow>
          <FusesRow>
            <Typography color="textSecondary" weight="bold">
              {t('fuses.permissions.CANNOT_BURN_FUSES')}
            </Typography>
            <TrafficLight $go={!wrapperData.fuseObj.CANNOT_BURN_FUSES} />
          </FusesRow>
          <FusesRow>
            <Typography color="textSecondary" weight="bold">
              {t('fuses.permissions.CANNOT_CREATE_SUBDOMAIN')}
            </Typography>
            <TrafficLight $go={!wrapperData.fuseObj.CANNOT_CREATE_SUBDOMAIN} />
          </FusesRow>
          <FusesRow>
            <Typography color="textSecondary" weight="bold">
              {t('fuses.permissions.CANNOT_SET_RESOLVER')}
            </Typography>
            <TrafficLight $go={!wrapperData.fuseObj.CANNOT_SET_RESOLVER} />
          </FusesRow>
          <FusesRow>
            <Typography color="textSecondary" weight="bold">
              {t('fuses.permissions.CANNOT_SET_TTL')}
            </Typography>
            <TrafficLight $go={!wrapperData.fuseObj.CANNOT_SET_TTL} />
          </FusesRow>
          <FusesRow>
            <Typography color="textSecondary" weight="bold">
              {t('fuses.permissions.CANNOT_TRANSFER')}
            </Typography>
            <TrafficLight $go={!wrapperData.fuseObj.CANNOT_TRANSFER} />
          </FusesRow>
          <FusesRow>
            <Typography color="textSecondary" weight="bold">
              {t('fuses.permissions.CANNOT_UNWRAP')}
            </Typography>
            <TrafficLight $go={!wrapperData.fuseObj.CANNOT_UNWRAP} />
          </FusesRow>
          <FusesRow>
            <Typography color="textSecondary" weight="bold">
              {t('fuses.permissions.PARENT_CANNOT_CONTROL')}
            </Typography>
            <TrafficLight $go={!wrapperData.fuseObj.PARENT_CANNOT_CONTROL} />
          </FusesRow>
        </div>
      </div>
    </FusesContainer>
  )
}

export default Fuses
