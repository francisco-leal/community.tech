"use client"

import * as React from "react"
import { ethers } from 'ethers'
import CommunityKeys from "@/lib/abi/CommunityKeys.json"
import { Icons } from "@/components/icons"
import { transactions } from "@/lib/api"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

import { useContext } from "react"
import { ConfigContext } from "@/lib/web3Context"
import { COMMUNITY_CONTRACT_ADDRESS, CHAIN_ID } from "@/lib/utils"
 
export function TradeKeysDialog() {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [sellPrice, setSellPrice] = React.useState<string>("0");
  const [buyPrice, setBuyPrice] = React.useState<string>("0");
  const [numberOfKeys, setNumberOfKeys] = React.useState<number>(0);
  const web3Auth = useContext(ConfigContext);

  React.useEffect(() => {
    if (isLoading) return;

    const getPrices = async () => {
      if(web3Auth) {
        const web3AuthProvider = web3Auth.getProvider();
        if (!web3AuthProvider) return;

        const provider = new ethers.providers.Web3Provider(web3AuthProvider)
        const contract = new ethers.Contract(COMMUNITY_CONTRACT_ADDRESS, CommunityKeys.abi, provider);
        const buyer = await provider.getSigner();

        const calculatedBuyPrice = await contract.getBuyPrice("denites", 1);
        const calculatedSellPrice = await contract.getSellPrice("denites", 1);
        setSellPrice(ethers.utils.formatUnits(calculatedSellPrice));
        setBuyPrice(ethers.utils.formatUnits(calculatedBuyPrice));

        const calculatedNumberOfKeys = await contract.communityKeys("denites", await buyer.getAddress());
        setNumberOfKeys(calculatedNumberOfKeys.toNumber());
      }
    }
    getPrices()
  }, [web3Auth, isLoading]);

  async function buyKey(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)
    
    if(web3Auth) {
      const web3AuthProvider = web3Auth.getProvider();
      if (!web3AuthProvider) return;

      const provider = new ethers.providers.Web3Provider(web3AuthProvider)
      const signer = provider.getSigner()

      const contract = new ethers.Contract(COMMUNITY_CONTRACT_ADDRESS, CommunityKeys.abi, signer);

      const price = await contract.getBuyPriceAfterFee("denites", 1);
      const buyAction = await contract.connect(signer).buyKey("denites", { value: price });
      await buyAction.wait();

      await transactions.createTransaction(buyAction.hash, CHAIN_ID)
    }

    setIsLoading(false)
  }

  async function sellKey(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)
    
    if(web3Auth) {
      // @ts-ignore
      const web3AuthProvider = web3Auth.getProvider();
      if (!web3AuthProvider) return;

      const provider = new ethers.providers.Web3Provider(web3AuthProvider)
      const signer = provider.getSigner()

      const contract = new ethers.Contract(COMMUNITY_CONTRACT_ADDRESS, CommunityKeys.abi, signer);

      const sellAction = await contract.connect(signer).sellKeys("denites", 1);
      await sellAction.wait();

      await transactions.createTransaction(sellAction.hash, CHAIN_ID)
    }

    setIsLoading(false)
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          className="text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white dark:text-blue-300 dark:border-blue-300 dark:hover:bg-blue-300 dark:hover:text-black"
          variant="outline"
        >
          Trade
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Trade Keys</AlertDialogTitle>

            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">You own {numberOfKeys} key</p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
              <span className="inline-block bg-gray-300 dark:bg-gray-700 px-2 py-1 rounded-full text-xs font-semibold text-gray-700 dark:text-gray-300 mr-2">
                Silver
              </span>
              Hold at least 2 keys
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
              <span className="inline-block bg-yellow-300 dark:bg-yellow-700 px-2 py-1 rounded-full text-xs font-semibold text-yellow-700 dark:text-yellow-300 mr-2">
                Gold
              </span>
              Hold at least 5 keys
            </p>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            className="w-full bg-red-500 hover:bg-red-600 text-white dark:bg-red-300 dark:hover:bg-red-200"
            variant="default"
            onClick={sellKey}
            disabled={isLoading}
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sell for {sellPrice} ETH
          </Button>
          <Button
            className="w-full mb-2 bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-300 dark:hover:bg-blue-200"
            variant="default"
            onClick={buyKey}
            disabled={isLoading}
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Buy for {buyPrice} ETH
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
