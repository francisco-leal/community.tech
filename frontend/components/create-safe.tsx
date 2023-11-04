"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import { useContext } from "react"
import { ConfigContext } from "@/lib/web3Context"
import { Icons } from "@/components/icons"

import { ethers } from 'ethers'
import { SafeFactory, EthersAdapter, SafeAccountConfig } from '@safe-global/protocol-kit'

interface CreateSafeProps extends React.HTMLAttributes<HTMLDivElement> {
  nextStep: Function,
}

export function CreateSafe({ className, nextStep, ...props }: CreateSafeProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const router = useRouter()

  const web3Auth = useContext(ConfigContext);

  async function createSafeAndMove(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)
    
    if(web3Auth) {
      // @ts-ignore
      const web3AuthProvider = web3Auth.getProvider();
      if (!web3AuthProvider) return;

      const provider = new ethers.providers.Web3Provider(web3AuthProvider)
      const signer = provider.getSigner()

      const ethAdapter = new EthersAdapter({
        ethers,
        signerOrProvider: signer || provider
      })

      const safeFactory = await SafeFactory.create({ ethAdapter: ethAdapter })
      const safeAccountConfig: SafeAccountConfig = {
        owners: [
          await signer.getAddress(),
        ],
        threshold: 1,
      }

      const safeSdkOwner1 = await safeFactory.deploySafe({ safeAccountConfig })

      const safeAddress = await safeSdkOwner1.getAddress()

      console.log("SAFE ADDRESS: ", safeAddress);
    }

    nextStep();
    setIsLoading(false)
  }

  return (
    <Button onClick={createSafeAndMove} disabled={isLoading}>
      {isLoading && (
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      )}
      Next
    </Button>
  )
}