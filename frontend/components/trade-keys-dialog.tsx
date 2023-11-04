import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
 
export function TradeKeysDialog() {
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
          <AlertDialogDescription className="text-left">
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">You own 1 key</p>
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
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            className="w-full bg-red-500 hover:bg-red-600 text-white dark:bg-red-300 dark:hover:bg-red-200"
            variant="default"
          >
            Sell for 0.01 ETH
          </Button>
          <Button
            className="w-full mb-2 bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-300 dark:hover:bg-blue-200"
            variant="default"
          >
            Buy for 0.02 ETH
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}