"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FindGame() {
  const [gameAddr, setGameAddr] = useState<string>("");
  const { push } = useRouter();

  const fetchGameDetails = () => {
    // TODO: Check if the game is actually there or not.
    if (gameAddr.length === 0) {
      toast("Please enter an address", { duration: 1000 });
    } else {
      toast(`Fetching ${gameAddr} now..`, { duration: 1000 });
      // redirect to /game/0xaddress.
      push(`/game/${gameAddr}`);
    }
  };

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
              onChange={(e) => setGameAddr(e.target.value)}
            />
          </div>

          <Button onClick={fetchGameDetails}>Find Game</Button>
        </div>
      </div>
    </>
  );
}
