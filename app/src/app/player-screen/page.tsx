import { Button } from "@/components/ui/button";

export default function Component() {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="flex gap-4">
          <div className="flex flex-col items-center justify-center p-6 bg-white shadow-md rounded-lg dark:bg-gray-800">
            <div className="w-16 h-16 bg-gray-200 animate-pulse rounded-lg dark:bg-gray-700" />
            <p className="mt-2 text-lg font-medium text-gray-800 dark:text-gray-200">
              Player 1
            </p>
          </div>
          <div className="flex flex-col items-center justify-center p-6 bg-white shadow-md rounded-lg dark:bg-gray-800">
            <div className="w-16 h-16 bg-gray-200 animate-pulse rounded-lg dark:bg-gray-700" />
            <p className="mt-2 text-lg font-medium text-gray-800 dark:text-gray-200">
              Player 2
            </p>
          </div>
        </div>
        <Button className="mt-4 px-8 py-4 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Start Game
        </Button>
        <p className="text-gray-900 dark:text-gray-100">
          2 / 2 players have joined the game
        </p>
      </div>
    </>
  );
}
