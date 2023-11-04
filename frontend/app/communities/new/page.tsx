"use client"
import * as React from 'react'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import Web3Provider from '@/lib/web3Context'
import { CreateSafe } from '@/components/create-safe'
import { CreateCommunity } from '@/components/create-community'

export default function NewCommunity() {
  const [wallet, setWallet] = React.useState<string>("Connect Wallet")
  const [communityProfile, setCommunityProfile] = React.useState<any>({})
  const [step, setStep] = React.useState<number>(2)
  const router = useRouter()

  async function onCancel(event: React.SyntheticEvent) {
    event.preventDefault()
    router.push('/communities')
  };
  
  async function nextStep(event: React.SyntheticEvent) {
    if(event) {
      event.preventDefault()
    }
    setStep((prev) => prev + 1)
  }

  async function previousStep(event: React.SyntheticEvent) {
    event.preventDefault()
    setStep((prev) => prev - 1)
  }

  async function finish(event: React.SyntheticEvent) {
    event.preventDefault()
    router.push('/communities')
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

  const updateCommunityProfile = (e: string, target: string) => {
    setCommunityProfile((prev: any) => ({
      ...prev,
      [target]: e
    }));
  };

  const firstStep = () => {
    return <>
      <div className="text-center text-2xl font-bold mb-4">Create community</div>
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" placeholder="Enter community name" required onChange={(e) => updateCommunityProfile(e.target.value, "name")}/>
      </div>
      <div className="space-y-2">
        <Label htmlFor="username">Handle</Label>
        <Input id="handle" placeholder="Choose a new handle" required onChange={(e) => updateCommunityProfile(e.target.value, "handle")}/>
      </div>
      <div className="space-y-2">
        <Label htmlFor="picture">Picture URL</Label>
        <Input id="picture" placeholder="Enter picture URL" required type="url" onChange={(e) => updateCommunityProfile(e.target.value, "profile_picture_url")}/>
      </div>
      <div className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <CreateSafe nextStep={nextStep} setSafe={(safeAddress: string) => updateCommunityProfile(safeAddress, "safeAddress")}/>
      </div>
    </>
  }

  const secondStep = () => {
    return <>
      <div className="text-center text-2xl font-bold mb-4">Create community</div>
      <div className="mb-4 p-4 bg-green-100 rounded-lg">
        <p className="font-semibold">Your community{"&apos"}s SAFE wallet has been created. The address is:</p>
        <code className="block mt-2 text-sm bg-gray-200 rounded p-2">
          {communityProfile.safeAddress || "Something went wrong"}
        </code>
      </div>
      <div className="space-y-2">
        <Label htmlFor="feePercentage">Fee Percentage</Label>
        <Input id="feePercentage" placeholder="Enter fee percentage" required onChange={(e) => updateCommunityProfile(e.target.value, "fee")}/>
        <p className="text-sm text-gray-500">
          This field determines the percentage of fees that will be taken from transactions within your community.
        </p>
      </div>
      <div className="flex justify-between">
        <Button variant="outline" onClick={previousStep}>Back</Button>
        <CreateCommunity nextStep={nextStep} profile={communityProfile}/>
      </div>
    </>
  }

  const thirdStep = () => {
    return <>
      <div className="mb-4 p-4 rounded-lg">
        <p className="font-semibold text-xl">Congratulations! 🎉 Your community has been created.</p>
        <p className="mt-4">As the owner of the community, you hold the first key</p>
      </div>
      <div className="flex justify-center">
        <Button onClick={finish}>Configure Telegram</Button>
      </div>
    </>
  };

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
        <main className="flex-grow flex justify-center mt-32">
          <form className="space-y-6 w-full max-w-md mx-auto px-8">
            <div className="flex justify-center space-x-2 mb-4">
              <svg
                className={`w-3 h-3 ${step === 1 ? "text-black dark:text-white" : "text-gray-400 dark:text-gray-600"}`}
                fill={step === 1 ? "currentColor" : "none"}
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
              </svg>
              <svg
                className={`w-3 h-3 ${step === 2 ? "text-black dark:text-white" : "text-gray-400 dark:text-gray-600"}`}
                fill={step === 2 ? "currentColor" : "none"}
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
              </svg>
              <svg
                className={`w-3 h-3 ${step === 3 ? "text-black dark:text-white" : "text-gray-400 dark:text-gray-600"}`}
                fill={step === 3 ? "currentColor" : "none"}
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
              </svg>
            </div>
            {step === 1 && firstStep()}
            {step === 2 && secondStep()}
            {step === 3 && thirdStep()}
          </form>
        </main>
      </div>
    </Web3Provider>
  )
}