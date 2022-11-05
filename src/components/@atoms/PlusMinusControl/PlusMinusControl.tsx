import { ChangeEventHandler, ForwardedRef, InputHTMLAttributes, forwardRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { VisuallyHidden } from '@epdomains/themey'

import MinusIcon from '@app/assets/Minus.svg'
import PlusIcon from '@app/assets/Plus.svg'
import { useDefaultRef } from '@app/hooks/useDefaultRef'
import { createChangeEvent } from '@app/utils/syntheticEvent'

const Container = styled.div<{ $highlighted?: boolean }>(
  ({ theme, $highlighted }) => css`
    width: 100%;
    padding: ${$highlighted ? theme.space['4'] : theme.space['1']};
    border: 1px solid ${theme.colors.borderSecondary};
    border-radius: ${theme.radii.full};
    display: flex;
    align-items: center;
    gap: ${theme.space['4']};
  `,
)

const Button = styled.button(
  ({ theme }) => css`
    height: ${theme.space['11']};
    width: ${theme.space['11']};
    border-radius: 50%;
    cursor: pointer;
    background: ${theme.colors.accent};
    display: flex;
    justify-content: center;
    align-items: center;

    svg {
      display: block;
      transform: scale(0.67);
      path {
        fill: ${theme.colors.white};
      }
    }
  `,
)

const Label = styled.div<{ $highlighted?: boolean }>(
  ({ theme, $highlighted }) => css`
    flex: 1;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    font-style: normal;
    font-weight: ${theme.fontWeights.bold};
    font-size: ${$highlighted ? theme.fontSizes.headingTwo : theme.fontSizes.large};
    line-height: ${theme.lineHeights.normal};
    text-align: center;
    color: ${$highlighted ? theme.colors.accent : theme.colors.text};
  `,
)

type InputProps = InputHTMLAttributes<HTMLInputElement>
type Props = {
  highlighted?: boolean
  value?: number
  minValue?: number
  maxValue?: number
  defaultValue?: number
  unit?: string
  name?: string
  onChange?: ChangeEventHandler<HTMLInputElement>
} & Omit<InputProps, 'value' | 'defaultValue' | 'min' | 'max'>

export const PlusMinusControl = forwardRef(
  (
    {
      value: _value,
      defaultValue,
      minValue,
      maxValue,
      name = 'plus-minus-control',
      unit = 'years',
      onChange,
      highlighted,
      ...props
    }: Props,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    const { t } = useTranslation('common')
    const inputRef = useDefaultRef<HTMLInputElement>(ref)

    const [value, setValue] = useState(_value || defaultValue || 1)

    const adjustValue = (v: number) => {
      if (minValue && v < minValue) {
        return minValue
      }
      if (maxValue && v > maxValue) {
        return maxValue
      }
      return v
    }

    const incrementHandler = (inc: number) => () => {
      const newValue = (value || 0) + inc
      const adjustedValue = adjustValue(newValue)
      if (adjustedValue === value) return
      setValue(adjustedValue)
      const newEvent = createChangeEvent(adjustedValue, name)
      onChange?.(newEvent)
    }

    const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
      const newValue = parseInt(e.target.value, 10)
      setValue(newValue)
      onChange?.(e)
    }

    return (
      <Container $highlighted={highlighted}>
        <Button type="button" onClick={incrementHandler(-1)} data-testid="plus-minus-control-minus">
          <MinusIcon />
        </Button>
        <Label $highlighted={highlighted}>{t(`unit.${unit}`, { count: value })}</Label>
        <Button type="button" onClick={incrementHandler(1)} data-testid="plus-minus-control-plus">
          <PlusIcon />
        </Button>
        <VisuallyHidden>
          <input
            type="number"
            {...props}
            ref={inputRef}
            value={value}
            onChange={handleChange}
            min={minValue}
            max={maxValue}
          />
        </VisuallyHidden>
      </Container>
    )
  },
)
