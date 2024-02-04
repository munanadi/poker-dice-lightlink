import {
  AceDice,
  JokerDice,
  KingDice,
  NineDice,
  QueenDice,
  TenDice,
} from "@/components/DiceFaces";
import { Button } from "./ui/button";
import Link from "next/link";
import { cn } from "@/libs/utils";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <h1 className="text-4xl font-bold mb-4 dark:text-white">Dice Poker</h1>

      <div className="m-2">Let's start playing</div>

      <div className="flex gap-2 p-3">
        <div className="animate-bounce">
          <KingDice />
        </div>
        <div className="animate-bounce delay-75">
          <QueenDice />
        </div>
        <div className="animate-bounce delay-100">
          <JokerDice />
        </div>
        <div className="animate-bounce">
          <TenDice />
        </div>
        <div className="animate-bounce delay-200">
          <NineDice />
        </div>
        <div className="animate-bounce delay-100">
          <AceDice />
        </div>
      </div>
      <div className="flex gap-4">
        <Link
          href="/start-game"
          className={cn("transition-colors hover:text-foreground/80")}
        >
          <Button variant="link" className="underline">
            Start a Game
          </Button>
        </Link>
        <Link
          href="/find-game"
          className={cn("transition-colors hover:text-foreground/80")}
        >
          <Button variant="link" className="underline">
            Find Game
          </Button>
        </Link>
      </div>
    </div>
  );
}
