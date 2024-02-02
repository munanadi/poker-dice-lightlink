"use client";

import { userPlayerDetailsStore } from "@/store/usePlayerDetailsStore";
import PlayerComponent from "@/components/PlayerComponent";

export default function PlayGame() {
  // TODO: handle directly landing on this page
  const { players } = userPlayerDetailsStore();

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="container">
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          {players &&
            players.map((player) => {
              const { playerAddr, bet, index, turn, hand } = player as any;
              console.log(playerAddr);
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
      </div>
    </div>
  );
}
