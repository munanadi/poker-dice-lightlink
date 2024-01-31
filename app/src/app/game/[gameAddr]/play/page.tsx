"use client";

import {
  useGameStateReads,
  useGetAllPlayerDetails,
} from "@/libs/contractHelpers";
import { diceFaceToString, fetchExplorerLink } from "@/libs/utils";
import { usePathname } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { Satellite } from "lucide-react";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { formatEther, parseEther } from "viem/utils";
import { abi } from "@/libs/abi";

export default function PlayGame() {
  const path = usePathname();
  const gameAddr = path.split("/")[2] as `0x${string}`;

  const [toAdd, setToAdd] = useState<boolean>(false);
  const [args, setArgs] = useState<{
    playerIndex: string | undefined;
    toAdd: boolean | undefined;
    betAmount: string | undefined;
  }>({
    playerIndex: undefined,
    toAdd: undefined,
    betAmount: undefined,
  });

  const { totalCountOfPlayers } = useGameStateReads(gameAddr);

  const { allPlayerDetails } = useGetAllPlayerDetails(
    gameAddr,
    parseInt(totalCountOfPlayers?.toString() ?? "0"),
  );

  const nonZeroPlayers = allPlayerDetails?.filter(
    (p) => parseInt((p.result as any)?.playerAddr?.slice(2)) != 0,
  );

  const { config, error, isError } = usePrepareContractWrite({
    address: gameAddr,
    abi,
    functionName: "changeBet",
    args: [BigInt(args.playerIndex ?? ""), args.toAdd ?? false],
    value: parseEther(args.betAmount ?? ""),
  });

  const { data, writeAsync } = useContractWrite(config);
  const { isLoading } = useWaitForTransaction({
    hash: data?.hash,
  });

  const callRollDice = () => {
    toast("call roll dice here", { duration: 1000 });
  };

  const callAdjustBet = async () => {
    if (
      !args.betAmount ||
      args.playerIndex == undefined ||
      args.toAdd == undefined
    ) {
      toast.error("Please enter the required args");
      return;
    }

    const data = await writeAsync?.();

    if (data?.hash) {
      toast(
        <div className="flex gap-2 justify-between">
          <div className="font-bold">Bet placed</div>
          <div className="text-sm text-slate-500 dark:text-slate-400 underline">
            <a target="_blank" href={fetchExplorerLink(data?.hash!, "tx")}>
              Explore Txn
            </a>
          </div>
        </div>,
      );
    }
  };

  const toggleSwitch = () => {
    setToAdd((state) => !state);
    setArgs((state) => ({ ...state, toAdd: !toAdd }));
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
                              {formatEther(bet.toString()).toString()} ETH
                            </span>

                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              Bet
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      {hand.map((face) => (
                        <div key={face + Math.random()}>
                          {diceFaceToString(face)}
                        </div>
                      ))}
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
                          onChange={(e) =>
                            setArgs((state) => ({
                              ...state,
                              betAmount: e.target.value,
                              playerIndex: index,
                            }))
                          }
                        />
                        <div className="flex flex-col gap-2 items-center mx-2">
                          <div className="flex gap-2 items-center">
                            {toAdd ? (
                              <Button
                                variant={"outline"}
                                onClick={toggleSwitch}
                              >
                                Add
                              </Button>
                            ) : (
                              <Button
                                variant={"outline"}
                                onClick={toggleSwitch}
                              >
                                Remove
                              </Button>
                            )}
                            {args.betAmount && (
                              <div className="flex gap-2">
                                <span className="text-sm text-slate-500 dark:text-slate-400">
                                  {toAdd ? "Adding" : "Reducing"}{" "}
                                  {args.betAmount}ETH
                                </span>
                                <span className="text-sm text-slate-500 dark:text-slate-400">
                                  New bet will be{" "}
                                  {/* TODO: Fix this calculation of new bet */}
                                  {toAdd
                                    ? parseFloat(bet) +
                                      parseFloat(args.betAmount)
                                    : parseFloat(bet) -
                                      parseFloat(args.betAmount)}
                                  ETH
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              disabled={!writeAsync}
                              onClick={callAdjustBet}
                            >
                              {isLoading ? "Adjusting Bet" : "Adjust Bet"}
                            </Button>
                            <Button onClick={callRollDice}>Roll Dice</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </main>
      </div>
      {/* Prepare Error */}
      {(isError || error) && <div>Error: {(error || error)?.message}</div>}
    </div>
  );
}
