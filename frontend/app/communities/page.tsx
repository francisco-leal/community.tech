"use client"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar"
import { useRouter } from 'next/navigation'
import { communitiesApi } from "@/lib/api"
import { Community } from "@/lib/api/types"
import Web3Provider from '@/lib/web3Context'
import { PriceOnList } from "@/components/price-on-list"

export default function Communities() {
  const [wallet, setWallet] = React.useState<string>("Connect Wallet")
  const [communities, setCommunities] = React.useState<Community[]>([])
  const [keyword, setKeyword] = React.useState<string>("")
  const router = useRouter()

  async function onClick(event: React.SyntheticEvent, name: string) {
    event.preventDefault()
    router.push(`/communities/${name}`);
  };

  async function goToHome(event: React.SyntheticEvent) {
    event.preventDefault()
    router.push(`/communities`);
  }

  async function goToProfile(event: React.SyntheticEvent, name: string) {
    event.preventDefault()
    router.push(`/members/${name}`);
  }

  async function createNewCommunity(event: React.SyntheticEvent) {
    event.preventDefault()
    router.push(`/communities/new`);
  }

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedWallet = sessionStorage.getItem('wallet');
      if (storedWallet) {
        setWallet(storedWallet);
      } else {
        router.push('/');
      }
    }
  });

  React.useEffect(() => {
    getCommunities(null);
  }, [])

  function handleSearch(keyword: string) {
    setKeyword(keyword);
    getCommunities(keyword)
  }

  async function getCommunities(keyword: string | null) {
    const response = await communitiesApi.getCommunities(keyword, null).catch(error => console.error(error));
    console.log(response)
    if(response && response.status == 200) {
      setCommunities(response.data.communities);
    }
  }

  return (
    <Web3Provider>
      <div className="flex flex-col h-screen">
        <header className="fixed top-0 left-0 right-0 bg-white dark:bg-zinc-800 shadow-md z-50 p-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">community.tech</h1>
          <Button
            className="text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white dark:text-blue-300 dark:border-blue-300 dark:hover:bg-blue-300 dark:hover:text-black"
            variant="outline"
          >
            {wallet}
          </Button>
        </header>
        <main className="pt-20 pb-16">
          <div className="p-4">
            <Input className="w-full" value={keyword} placeholder="Search..." type="search" onChange={(e) => handleSearch(e.target.value)} />
            <div className="space-y-4 mt-4">
              {communities.map((community) => (
                <div key={community.name} className="flex items-center space-x-4 p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 cursor-pointer" onClick={(e) => onClick(e, community.name)}>
                <Avatar className="h-10 w-10">
                  <AvatarImage alt="Community Avatar" src={community.picture_url} />
                  <AvatarFallback>CA</AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                  <h4 className="text-md font-medium">{community.name}</h4>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">Members: {community.members_count}</p>
                </div>
                <div className="text-right">
                  <PriceOnList communityName={community.name}/>
                </div>
              </div>
              ))}
            </div>
          </div>
        </main>
        <footer className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-800 shadow-md z-50 p-4 flex items-center justify-around">
          <Button variant="ghost" onClick={goToHome}>
            <svg
              className=" text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-300"
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </Button>
          <Button variant="ghost" onClick={createNewCommunity}>
            <svg
              className=" text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-300"
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M8 12h8" />
              <path d="M12 8v8" />
            </svg>
          </Button>
          <Button variant="ghost" onClick={(e) => goToProfile(e, wallet)}>
            <svg
              className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-300"
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </Button>
        </footer>
      </div>
    </Web3Provider>
  )
}