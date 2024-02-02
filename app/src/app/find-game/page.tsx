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

export default function FindGame() {
  // TODO: add debounce here.
  const [gameAddr, setGameAddr] = useState<`0x${string}`>("0x");
  const debouncedGameAddr = useDebounce(gameAddr, 1000);
  const { push } = useRouter();

  const { setGameState } = useGameStateStore();

  const gameContract = {
    address: debouncedGameAddr,
    abi: abi,
  } as const;

  const { data, error } = useContractReads({
    contracts: [
      {
        ...gameContract,
        functionName: "getGameState",
      },
      {
        ...gameContract,
        functionName: "getCurrentCountOfPlayers",
      },
      {
        ...gameContract,
        functionName: "getTotalNumberOfPlayers",
      },
      {
        ...gameContract,
        functionName: "getTotalPrizePool",
      },
    ],
  });

  let currentCountOfPlayers: string | undefined;
  let totalCountOfPlayers: string | undefined;
  let totalBet: string | undefined;
  let gameState: string | undefined;

  if (
    data &&
    data.every(
      (d) =>
        d.status == "failure" &&
        debouncedGameAddr != "0x" &&
        debouncedGameAddr != ("" as `0x${string}`),
    )
  ) {
    toast.error(`${debouncedGameAddr} is not a game`, {
      description: `Please check your address`,
    });
  } else if (error) {
    console.log(error);
    toast.error("fetching game data failed.");
  } else if (
    data &&
    data.every(
      (d) =>
        d.status == "success" &&
        debouncedGameAddr != "0x" &&
        debouncedGameAddr != ("" as `0x${string}`),
    )
  ) {
    toast.success(`${debouncedGameAddr} game found!`);
    gameState = (data[0].result ?? -1).toString();
    currentCountOfPlayers = (data[1].result ?? -1).toString();
    totalCountOfPlayers = (data[2].result ?? -1).toString();
    totalBet = (data[3].result ?? -1).toString();
  }

  const fetchGameDetails = () => {
    // TODO: Check if the game is actually there or not.
    if (gameFound) {
      toast(`Fetching ${debouncedGameAddr} now..`);
      setGameState({
        totalBet: parseInt(totalBet ?? "-1"),
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
    totalBet != undefined;

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

          <Button onClick={fetchGameDetails}>
            {gameFound ? "Fetch Game" : "Find Game"}
          </Button>
        </div>
      </div>
    </>
  );
}
