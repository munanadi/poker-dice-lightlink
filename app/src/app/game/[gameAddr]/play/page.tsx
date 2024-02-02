"use client";

import { userPlayerDetailsStore } from "@/store/usePlayerDetailsStore";
import PlayerComponent from "@/components/PlayerComponent";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, MoveLeft } from "lucide-react";
import {
  useGameStateReads,
  useGetAllPlayerDetails,
} from "@/libs/contractHelpers";
import { useEffect } from "react";

export default function PlayGamesss() {
  const { replace } = useRouter();
  const pathName = usePathname();
  const gameAddr = pathName.split("/")?.[2] as `0x${string}`;

  // TODO: handle directly landing on this page
  const { players: playersFromStore } = userPlayerDetailsStore();

  const setPlayers = userPlayerDetailsStore((state) => state.setPlayers);
  const { totalCountOfPlayers } = useGameStateReads(gameAddr);

  const { allPlayerDetails, error } = useGetAllPlayerDetails(
    gameAddr,
    parseInt(totalCountOfPlayers?.toString() || "0"),
  );

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

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="container">
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
      </div>
    </div>
  );
}
