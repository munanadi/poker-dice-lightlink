"use client";

import { userPlayerDetailsStore } from "@/store/usePlayerDetailsStore";
import PlayerComponent from "@/components/PlayerComponent";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import {
  useGameStateReads,
  useGetAllPlayerDetails,
} from "@/libs/contractHelpers";
import { useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { useContractWrite } from "wagmi";
import { abi } from "@/libs/abi";
import { toast } from "sonner";
import { fetchExplorerLink } from "@/libs/utils";

export default function PlayGamesss() {
  const { replace, push } = useRouter();
  const pathName = usePathname();
  const gameAddr = pathName.split("/")?.[2] as `0x${string}`;

  // TODO: handle directly landing on this page
  const { players: playersFromStore } = userPlayerDetailsStore();

  const setPlayers = userPlayerDetailsStore((state) => state.setPlayers);
  const { totalCountOfPlayers, gameState, currentCountOfPlayers } =
    useGameStateReads(gameAddr);

  const { allPlayerDetails, error } = useGetAllPlayerDetails(
    gameAddr,
    parseInt(totalCountOfPlayers?.toString() || "0"),
  );

  const {
    data: pickWinnerData,
    error: pickWinnerError,
    isError: isPickWinnerError,
    writeAsync: pickWinnerWrite,
  } = useContractWrite({
    address: gameAddr,
    abi,
    functionName: "pickWinner",
  });

  const playerDetails = error == "no players yet" ? [] : allPlayerDetails;

  useEffect(() => {
    const nonZeroPlayers = (playerDetails ?? [])?.filter(
      (d) => parseInt((d.result as any)?.playerAddr?.slice(2)) != 0,
    );

    const players = nonZeroPlayers?.map((d) => d?.result as any);

    setPlayers(players);
  }, [totalCountOfPlayers, gameAddr]);

  const goBack = () => {
    replace(`/game/${gameAddr}`);
  };

  const nonZeroPlayers: any = (playerDetails ?? [])?.filter(
    (d) => parseInt((d.result as any)?.playerAddr?.slice(2)) != 0,
  );

  const players =
    playersFromStore ?? nonZeroPlayers.length != 0
      ? nonZeroPlayers?.map((d: any) => d?.result as any)
      : [];

  const pickWinner = async () => {
    let data;
    try {
      data = await pickWinnerWrite?.();

      if (data?.hash) {
        toast.success(
          <div className="flex gap-2 justify-between">
            <div className="font-bold">Picking Winner</div>
            <div className="text-sm text-slate-500 dark:text-slate-400 underline">
              <a target="_blank" href={fetchExplorerLink(data?.hash!, "tx")}>
                Explore Txn
              </a>
            </div>
          </div>,
        );

        // navigate to /winner here
        push(`/game/${gameAddr}/winner`);
      } else {
        console.log(data);
        toast.error("something went wrong while playing round");
      }
    } catch (e) {
      console.log(e);
      return;
    }
  };

  const isGameOver = parseInt(gameState ?? "-1") == 3;

  const isWaitingOnOtherPlayers =
    parseInt(currentCountOfPlayers ?? "-1") <
    parseInt(totalCountOfPlayers ?? "-1");

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="container">
        <Button variant={"link"} onClick={goBack}>
          <ArrowLeftIcon className="mt-4" />
        </Button>
        {!players || players.length == 0 ? (
          <div className="flex justify-start">
            <Button size="icon" variant="outline" onClick={goBack}>
              <ArrowLeftIcon />
              <span className="sr-only">Back</span>
            </Button>
            <div className="text-center text-lg mt-4">
              No players in the game yet
            </div>
          </div>
        ) : (
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
            {players &&
              players.map((player: any) => {
                const { playerAddr, bet, index, turn, hand } = player as any;
                return (
                  <PlayerComponent
                    key={playerAddr}
                    playerAddr={playerAddr}
                    bet={bet}
                    index={index}
                    turn={turn}
                    hand={hand}
                  />
                );
              })}
          </main>
        )}
        {isGameOver && (
          <>
            <Separator />
            <Separator />
            <Separator />
            <div className="flex flex-col gap-5 items-center justify-around mt-10">
              <div>Game is Over!</div>
              <Button onClick={pickWinner}>Pick Winner</Button>
            </div>
          </>
        )}
        {isWaitingOnOtherPlayers && (
          <>
            <Separator />
            <Separator />
            <Separator />
            <div className="flex flex-col gap-5 items-center justify-around mt-10">
              <div>Waiting on other players...</div>
            </div>
          </>
        )}
      </div>
      {/* Prepare Error */}
      {(isPickWinnerError || pickWinnerError) && (
        <div>Error: {(pickWinnerError || pickWinnerError)?.message}</div>
      )}
    </div>
  );
}
