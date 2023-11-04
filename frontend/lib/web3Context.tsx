import { Web3AuthModalPack } from '@safe-global/auth-kit'
import { OpenloginAdapter } from '@web3auth/openlogin-adapter'
import { Web3AuthOptions } from '@web3auth/modal'
import { CHAIN_NAMESPACES, WALLET_ADAPTERS } from '@web3auth/base'
import React, { createContext, useState, useEffect } from 'react';

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

const web3AuthConfig = {
  txServiceUrl: 'https://safe-transaction-goerli.safe.global'
}

export const ConfigContext = createContext<Web3AuthModalPack|null>(null);

const ConfigProvider = ({ children }: any) => {
  const [config, setConfig] = useState<Web3AuthModalPack|null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      // Instantiate and initialize the pack
      const web3AuthModalPack = new Web3AuthModalPack(web3AuthConfig)

      await web3AuthModalPack.init({ options, adapters: [openloginAdapter], modalConfig })
      setConfig(web3AuthModalPack);
    };

    fetchConfig();
  }, []);

  return (
    <ConfigContext.Provider value={config}>
      {children}
    </ConfigContext.Provider>
  );
};

export default ConfigProvider;
