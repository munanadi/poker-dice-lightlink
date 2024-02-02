"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@uidotdev/usehooks";
import { useGameStateStore } from "@/store/useGameStore";
import { useContractReads } from "wagmi";
import { abi } from "@/libs/abi";
import { useGameStateReads } from "@/libs/contractHelpers";

export default function FindGame() {
  const [gameAddr, setGameAddr] = useState<`0x${string}`>("0x");
  const debouncedGameAddr = useDebounce(gameAddr, 1000);
  const { push } = useRouter();

  const { setGameState } = useGameStateStore();

  const {
    currentCountOfPlayers,
    error,
    gameState,
    getTotalPrizePool,
    totalCountOfPlayers,
  } = useGameStateReads(debouncedGameAddr);

  if (error == "not a game" || error == "enter valid address") {
    toast.error(`${debouncedGameAddr} is not a game`, {
      description: `Please check your address`,
    });
  } else if (error) {
    console.log(error);
    toast.error("fetching game data failed.");
  } else {
    toast.success(`${debouncedGameAddr} game found!`);
  }

  const fetchGameDetails = () => {
    // TODO: Check if the game is actually there or not.
    if (gameFound) {
      toast(`Fetching ${debouncedGameAddr} now..`);
      setGameState({
        totalBet: parseInt(getTotalPrizePool ?? "-1"),
        currentCountOfPlayers: parseInt(currentCountOfPlayers ?? "-1"),
        gameState: parseInt(gameState ?? "-1"),
        totalCountOfPlayers: parseInt(totalCountOfPlayers ?? "-1"),
        gameAddress: debouncedGameAddr,
      });
      // redirect to /game/0xaddress.
      push(`/game/${gameAddr}`);
    }
  };

  const gameFound =
    gameState != undefined &&
    currentCountOfPlayers != undefined &&
    totalCountOfPlayers != undefined &&
    getTotalPrizePool != undefined;

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <div className="mx-2">
            <Label htmlFor="game-contract-address">Game Contract Address</Label>
            <Input
              type="text"
              id="game-contract-address"
              placeholder="0xgameContractAddressHere"
              onChange={(e) => setGameAddr(e.target.value as `0x${string}`)}
            />
          </div>

          <Button onClick={fetchGameDetails} disabled={!gameFound}>
            {gameFound ? "Fetch Game" : "Find Game"}
          </Button>
        </div>
      </div>
    </>
  );
}
