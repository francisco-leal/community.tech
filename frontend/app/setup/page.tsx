"use client"
import * as React from 'react'
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import { Icons } from "@/components/icons"
import { usersApi } from "@/lib/api";

export default function Setup() {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [telegramHandle, setTelegramHandle] = React.useState<string>("")
  const router = useRouter()

  async function onClick(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)

    const wallet = sessionStorage.getItem('wallet');
    if(wallet) {
      await usersApi.createUser(wallet, telegramHandle).catch((error) => {
        console.error(error);
      });;
    }

    setTimeout(() => {
      router.push('/communities')
      setIsLoading(false)
    }, 3000)
  };

  return (
    <div className="h-screen flex flex-col">
      <main className="flex-grow flex items-center justify-center">
        <form className="space-y-6 w-full max-w-md mx-auto">
          <div className="text-center text-2xl font-bold mb-4">Connect Telegram</div>
          <div className="flex justify-center">
            <img
              alt="Avatar"
              className="rounded-full"
              height="100"
              src="/default-profile-picture.png"
              style={{
                aspectRatio: "100/100",
                objectFit: "cover",
              }}
              width="100"
            />
          </div>
          <div className="text-center text-lg mb-4">Name.eth</div>
          <div className="flex flex-col justify-center items-center">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="telegram-handle">
              Telegram Handle
            </label>
            <input
              className="mt-1 block w-1/2 py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              id="telegram-handle"
              name="telegram-handle"
              placeholder="@username"
              required
              type="text"
              onChange={(event) => setTelegramHandle(event.target.value)}
            />
          </div>
          <div className="flex justify-center">
            <Button type="submit" variant="default" disabled={isLoading} onClick={onClick}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Profile
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}