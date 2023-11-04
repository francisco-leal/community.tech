"use client"
import { Inter } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import { Web3AuthModalPack, Web3AuthConfig } from '@safe-global/auth-kit'
import { Web3AuthOptions } from '@web3auth/modal'
import { OpenloginAdapter } from '@web3auth/openlogin-adapter'
import { CHAIN_NAMESPACES, WALLET_ADAPTERS } from '@web3auth/base'
import { useEffect } from 'react'

const inter = Inter({ subsets: ['latin'], variable: "--font-sans"})

// https://web3auth.io/docs/sdk/pnp/web/modal/initialize#arguments
const options: Web3AuthOptions = {
  clientId: 'BKKhCjwWMOU4_bREyeZ_-wwJd8d3fLQiK1HXIMptR2T4lgY7qyEAKwJsrAiUMZjx4LKkxEKzRu3f6_43Ug3kGFw', // https://dashboard.web3auth.io/
  web3AuthNetwork: 'testnet',
  chainConfig: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: '0x45b',
    // https://chainlist.org/
    rpcTarget: 'https://rpc.test.btcs.network',
    blockExplorer: 'https://scan.test.btcs.network',
    displayName: 'Core Testnet',
    ticker: 'tCore',
    tickerName: 'tCore',
  },
  uiConfig: {
    theme: 'dark',
    loginMethodsOrder: ['google', 'facebook']
  }
}

const modalConfig = {
  [WALLET_ADAPTERS.METAMASK]: {
    label: 'metamask',
    showOnDesktop: true,
    showOnMobile: true
  }
}

const openloginAdapter = new OpenloginAdapter({
  loginSettings: {
    mfaLevel: 'mandatory'
  },
  adapterSettings: {
    uxMode: 'popup',
    whiteLabel: {
      name: 'Safe'
    }
  }
})

const web3AuthConfig: Web3AuthConfig = {
  txServiceUrl: 'https://safe-transaction-goerli.safe.global'
}

// Instantiate and initialize the pack
const web3AuthModalPack = new Web3AuthModalPack(web3AuthConfig)

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    const setupWeb3Auth = async () => {
      // @ts-ignore
      window.web3AuthModalPack = web3AuthModalPack
      await web3AuthModalPack.init({ options, adapters: [openloginAdapter], modalConfig })
    };

    setupWeb3Auth();
  });

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="description"
          content="The marketplace for communities."/>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>community.tech</title>
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable
        )}
      >
        {children}
      </body>
    </html>
  )
}
