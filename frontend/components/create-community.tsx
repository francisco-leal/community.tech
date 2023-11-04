"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { useContext } from "react"
import { ConfigContext } from "@/lib/web3Context"
import { Icons } from "@/components/icons"

import { ethers } from 'ethers'
import CommunityKeys from "@/lib/abi/CommunityKeys.json"
import { communitiesApi } from "@/lib/api/communities"
import { transactions } from "@/lib/api"

interface CreateSafeProps extends React.HTMLAttributes<HTMLDivElement> {
  nextStep: Function,
  profile: {
    name: string,
    safeAddress: string,
    fee: string,
    profile_picture_url: string,
    description: string,
  }
}

const COMMUNITY_CONTRACT_ADDRESS = "0x664d86CF8D30EEC4169393a70EB3aa796BE85642";
const CHAIN_ID = "1115";

export function CreateCommunity({ className, nextStep, profile, ...props }: CreateSafeProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const web3Auth = useContext(ConfigContext);

  async function createCommunity(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)
    
    if(web3Auth) {
      // @ts-ignore
      const web3AuthProvider = web3Auth.getProvider();
      if (!web3AuthProvider) return;

      const provider = new ethers.providers.Web3Provider(web3AuthProvider)
      const signer = provider.getSigner()

      const contract = new ethers.Contract(COMMUNITY_CONTRACT_ADDRESS, CommunityKeys.abi, signer);

      const createTx = await contract.connect(signer).createCommunity(profile.safeAddress, ethers.utils.parseUnits(profile.fee, "ether"), profile.name);
      await createTx.wait();

      await communitiesApi.createCommunity(
        await signer.getAddress(),
        profile.name,
        "",
        profile.profile_picture_url,
        profile.safeAddress
      )
      await transactions.createTransaction(createTx.hash, CHAIN_ID)
    }

    nextStep(event);
    setIsLoading(false)
  }

  return (
    <Button onClick={createCommunity} disabled={isLoading}>
      {isLoading && (
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      )}
      Next
    </Button>
  )
}
