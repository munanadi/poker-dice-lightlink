"use client";

import {
  AceDice,
  JokerDice,
  KingDice,
  NineDice,
  QueenDice,
  TenDice,
  EmptyDice,
} from "@/components/DiceFaces";
import {
  useGameStateReads,
  useGetAllPlayerDetails,
} from "@/libs/contractHelpers";
import { diceFaceToString } from "@/libs/utils";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function PlayGame() {
  const path = usePathname();
  const gameAddr = path.split("/")[2] as `0x${string}`;

  const { totalCountOfPlayers } = useGameStateReads(gameAddr);

  const { allPlayerDetails } = useGetAllPlayerDetails(
    gameAddr,
    parseInt(totalCountOfPlayers?.toString() || "0"),
  );

  const nonZeroPlayers = allPlayerDetails?.filter(
    (p) => parseInt((p.result as any)?.playerAddr?.slice(2)) != 0,
  );

  const callRollDice = () => {
    toast("call roll dice here", { duration: 1000 });
  };

  const callAdjustBet = () => {
    toast("call adjust bet here", { duration: 1000 });
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="container">
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          {nonZeroPlayers &&
            nonZeroPlayers.map((player) => {
              const {
                playerAddr,
                bet,
                index,
                turn,
                hand: rawHand,
              } = player.result as any;
              const hand = rawHand.toString().split(",") as Array<number>;
              return (
                <div
                  key={playerAddr}
                  className="flex flex-col items-center gap-2 justify-evenly"
                >
                  <div className="flex gap-4">
                    <div>
                      <h2>Player {playerAddr}</h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400"></p>
                      <div className="flex gap-2 mt-4 justify-around">
                        <div className="flex item-center align-middle gap-2">
                          <div className="flex flex-col items-center">
                            <span className="text-2xl font-bold">
                              {turn.toString()}{" "}
                              <span className="text-sm text-slate-500 dark:text-slate-400">
                                / 2
                              </span>
                            </span>

                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              Turn
                            </span>
                          </div>
                        </div>
                        <div className="flex item-center gap-2">
                          <div className="flex flex-col items-center">
                            <span className="text-2xl font-bold">
                              {bet.toString()}
                            </span>

                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              Bet
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      {hand.map((face) => diceFaceToString(face))}
                    </div>
                  </div>
                  <div>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <Label htmlFor="bet-amount">Bet Amount</Label>
                        <Input
                          id="bet-amount"
                          placeholder="0.1 ETH"
                          type="number"
                        />
                        <div className="flex gap-2">
                          <Button onClick={callAdjustBet}>Adjust bet</Button>
                          <Button onClick={callRollDice}>Roll Dice</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </main>
      </div>
    </div>
  );
}
