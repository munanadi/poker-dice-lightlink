"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@uidotdev/usehooks";
import { useGameStateStore } from "@/store/useGameStore";
import { useContractReads, usePrepareSendTransaction } from "wagmi";
import { encodeDeployData, encodePacked } from "viem";
import { abi } from "@/libs/abi";
import { useGameStateReads } from "@/libs/contractHelpers";

export default function StartGame() {
  const [airnodeRrp, setAirnodeRrp] = useState<`0x${string}`>("0x");
  const [numberOfPlayers, setNumberOfPlayers] = useState<number>(0);
  const [airnodeAddress, setAirnodeAddress] = useState<`0x${string}`>("0x");
  const [airnodeXPub, setAirnodeXPub] = useState<`xpub${string}`>("xpub");
  const [endpointUin256, setEndpointUint256] = useState<`0x${string}`>("0x");
  const [endpointUint256Array, setEndpointUint256Array] =
    useState<`0x${string}`>("0x");

  const deployedContractAddress = `0x`;

  // const s = usePrepareSendTransaction({to: , value: , da})

  // const debouncedGameAddr = useDebounce(gameAddr, 1000);
  // const { push } = useRouter();

  // const { setGameState } = useGameStateStore();

  // const {
  //   currentCountOfPlayers,
  //   error,
  //   gameState,
  //   getTotalPrizePool,
  //   totalCountOfPlayers,
  // } = useGameStateReads(debouncedGameAddr);

  // if (error == "not a game" || error == "enter valid address") {
  //   toast.error(`${debouncedGameAddr} is not a game`, {
  //     description: `Please check your address`,
  //   });
  // } else if (error) {
  //   console.log(error);
  //   toast.error("fetching game data failed.");
  // } else {
  //   toast.success(`${debouncedGameAddr} game found!`);
  // }

  // const fetchGameDetails = () => {
  //   // TODO: Check if the game is actually there or not.
  //   if (gameFound) {
  //     toast(`Fetching ${debouncedGameAddr} now..`);
  //     setGameState({
  //       totalBet: parseInt(getTotalPrizePool ?? "-1"),
  //       currentCountOfPlayers: parseInt(currentCountOfPlayers ?? "-1"),
  //       gameState: parseInt(gameState ?? "-1"),
  //       totalCountOfPlayers: parseInt(totalCountOfPlayers ?? "-1"),
  //       gameAddress: debouncedGameAddr,
  //     });
  //     // redirect to /game/0xaddress.
  //     push(`/game/${gameAddr}`);
  //   }
  // };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <div className="mx-2">
            <Label htmlFor="airnode-rrp-addresss">Airnode Rrp Address</Label>
            <Input
              type="text"
              id="airnode-rrp-addresss"
              placeholder="0xAirnodeRrpContract"
              onChange={(e) => setAirnodeRrp(e.target.value as `0x${string}`)}
            />
          </div>
          <div className="mx-2">
            <Label htmlFor="number-of-players">Number Of Players</Label>
            <Input
              type="text"
              id="number-of-players"
              placeholder="0"
              onChange={(e) => setNumberOfPlayers(parseInt(e.target.value))}
            />
          </div>
          <div className="mx-2">
            <Label htmlFor="airnode-address">Airnode Address</Label>
            <Input
              type="text"
              id="airnode-address"
              placeholder="0xAirnodeAddress"
              onChange={(e) =>
                setAirnodeAddress(e.target.value as `0x${string}`)
              }
            />
          </div>
          <div className="mx-2">
            <Label htmlFor="airnode-xpub">Airnode Xpub</Label>
            <Input
              type="text"
              id="airnode-xpub"
              placeholder="0xewlnvdsaealksLKckasflasdf"
              onChange={(e) =>
                setAirnodeXPub(e.target.value as `xpub${string}`)
              }
            />
          </div>
          <div className="mx-2">
            <Label htmlFor="endpoint-uint256">EndpointUin256</Label>
            <Input
              type="text"
              id="endpoint-uint256"
              placeholder="0xendpointuint256"
              onChange={(e) =>
                setEndpointUint256(e.target.value as `0x${string}`)
              }
            />
          </div>
          <div className="mx-2">
            <Label htmlFor="endpoint-uint256-array">EndpointUin256Array</Label>
            <Input
              type="text"
              id="endpoint-uint256-array"
              placeholder="0xendpointuint256array"
              onChange={(e) =>
                setEndpointUint256Array(e.target.value as `0x${string}`)
              }
            />
          </div>

          <Button onClick={() => console.log("Create game")}>Start Game</Button>
        </div>
      </div>
    </>
  );
}
