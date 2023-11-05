"use client"

import * as React from "react"
import { ethers } from 'ethers'
import CommunityKeys from "@/lib/abi/CommunityKeys.json"

import { useContext } from "react"
import { ConfigContext } from "@/lib/web3Context"
import { COMMUNITY_CONTRACT_ADDRESS } from "@/lib/utils"
 
export function PriceOnList({ communityName }: { communityName: string }) {
  const [buyPrice, setBuyPrice] = React.useState<string>("0");
  const web3Auth = useContext(ConfigContext);

  React.useEffect(() => {
    const getPrices = async () => {
      if(web3Auth) {
        const web3AuthProvider = web3Auth.getProvider();
        if (!web3AuthProvider) return;

        const provider = new ethers.providers.Web3Provider(web3AuthProvider)
        const contract = new ethers.Contract(COMMUNITY_CONTRACT_ADDRESS, CommunityKeys.abi, provider);

        const calculatedBuyPrice = await contract.getBuyPrice(communityName, 1);
        setBuyPrice(ethers.utils.formatUnits(calculatedBuyPrice));
      }
    }
    getPrices()
  }, [web3Auth]);

  return (
    <p className="font-semibold">{buyPrice} ETH</p>
  )
}
