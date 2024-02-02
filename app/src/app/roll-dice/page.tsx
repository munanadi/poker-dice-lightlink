import { Button } from "@/components/ui/button";

export default function RollDice() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <h1 className="text-4xl font-bold mb-8 dark:text-white">Dice Poker</h1>
      <div className="flex flex-row space-x-4 mb-8">
        <div className="w-16 h-16 flex items-center justify-center bg-white shadow-lg rounded-lg dark:bg-gray-800">
          <div></div>
        </div>
        <div className="w-16 h-16 flex items-center justify-center bg-white shadow-lg rounded-lg dark:bg-gray-800">
          {/* <Dice1Icon className="h-8 w-8 text-gray-900 dark:text-gray-100" /> */}
          <KingIcon className="h-10 w-10 text-gray-900 dark:text-gray-100" />

          {/* <div className=" text-gray-900 dark:text-gray-100 flex items-center">
            K
          </div> */}
        </div>
        <div className="w-16 h-16 flex items-center justify-center bg-white shadow-lg rounded-lg dark:bg-gray-800">
          {/* <Dice2Icon className="h-8 w-8 text-gray-900 dark:text-gray-100" /> */}
          <div className="text-gray-900 dark:text-gray-100 flex items-center">
            Q
          </div>
        </div>
        <div className="w-16 h-16 flex items-center justify-center bg-white shadow-lg rounded-lg dark:bg-gray-800">
          {/* <Dice3Icon className="h-8 w-8 text-gray-900 dark:text-gray-100" /> */}
          <div className=" text-gray-900 dark:text-gray-100 flex items-center">
            J
          </div>
        </div>
        <div className="w-16 h-16 flex items-center justify-center bg-white shadow-lg rounded-lg dark:bg-gray-800">
          {/* <Dice4Icon className="h-8 w-8 text-gray-900 dark:text-gray-100" /> */}
          <div className=" text-gray-900 dark:text-gray-100 flex items-center">
            10
          </div>
        </div>
        <div className="w-16 h-16 flex items-center justify-center bg-white shadow-lg rounded-lg dark:bg-gray-800">
          {/* <Dice5Icon className="h-8 w-8 text-gray-900 dark:text-gray-100" /> */}
          <div className=" text-gray-900 dark:text-gray-100 flex items-center">
            9
          </div>
        </div>
        <div className="w-16 h-16 flex items-center justify-center bg-white shadow-lg rounded-lg dark:bg-gray-800">
          {/* <Dice6Icon className="h-8 w-8 text-gray-900 dark:text-gray-100" /> */}
          <div className=" text-gray-900 dark:text-gray-100 flex items-center">
            A
          </div>
        </div>
      </div>
      <Button className="mb-8">Roll Dice</Button>
      <div className="w-full max-w-md p-4 bg-white shadow-lg rounded-lg dark:bg-gray-800">
        <p className="text-gray-900 dark:text-gray-100">
          Roll the dice to see the outcome of your poker hand.
        </p>
      </div>
    </div>
  );
}

function KingIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-crown"
    >
      <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
    </svg>
  );
}
