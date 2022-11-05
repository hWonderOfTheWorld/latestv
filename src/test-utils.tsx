/* eslint-disable import/no-extraneous-dependencies */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RenderOptions, render } from '@testing-library/react'
import { RenderHookOptions, renderHook } from '@testing-library/react-hooks'
import userEvent from '@testing-library/user-event'
import { MockConnector } from '@wagmi/core/connectors/mock'
import { providers } from 'ethers'
import { Wallet } from 'ethers/lib/ethers'
import React, { FC, ReactElement } from 'react'
import { ThemeProvider } from 'styled-components'
import { WagmiConfig, createClient } from 'wagmi'

import { ThorinGlobalStyles, lightTheme } from '@epdomains/themey'

jest.mock('wagmi', () => {
  const { useQuery, useInfiniteQuery, createClient, WagmiConfig } = jest.requireActual('wagmi')

  return {
    useQuery,
    useInfiniteQuery,
    createClient,
    WagmiConfig,
    useAccount: jest.fn(),
    useNetwork: jest.fn(),
    useProvider: jest.fn(),
    useSigner: jest.fn(),
    useSignTypedData: jest.fn(),
    useBlockNumber: jest.fn(),
    useSendTransaction: jest.fn(),
  }
})

jest.mock('@app/components/@molecules/NFTTemplate', () => () => <div data-testid="nft-template" />)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: Infinity,
      retry: false,
    },
  },
  logger: {
    log: console.log,
    warn: console.warn,
    error: () => {},
  },
})

beforeEach(() => queryClient.clear())

const privateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'

class EthersProviderWrapper extends providers.StaticJsonRpcProvider {
  toJSON() {
    return `<Provider network={${this.network.chainId}} />`
  }
}

const wagmiClient = createClient({
  connectors: [
    new MockConnector({
      options: {
        signer: new Wallet(privateKey, new EthersProviderWrapper()),
      },
    }),
  ],
  provider: () => new EthersProviderWrapper(),
})

const AllTheProviders: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig client={wagmiClient}>
        <ThemeProvider theme={lightTheme}>
          <ThorinGlobalStyles />
          {children}
        </ThemeProvider>
      </WagmiConfig>
    </QueryClientProvider>
  )
}

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options })

const customRenderHook = <TProps, TResult>(
  callback: (props: TProps) => TResult,
  options?: Omit<RenderHookOptions<TProps>, 'wrapper'>,
) => renderHook(callback, { wrapper: AllTheProviders as any, ...options })

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>
    }
  : T

export type PartialMockedFunction<T extends (...args: any) => any> = (
  ...args: Parameters<T>
) => DeepPartial<ReturnType<T>>

export const mockFunction = <T extends (...args: any) => any>(func: T) =>
  func as unknown as jest.MockedFunction<PartialMockedFunction<T>>

export * from '@testing-library/react'
export { customRender as render }
export { customRenderHook as renderHook }
export { userEvent }
