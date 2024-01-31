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
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
  useContractEvent,
} from "wagmi";
import { formatEther, parseEther } from "viem/utils";
import { abi } from "@/libs/abi";
import { Check } from "lucide-react";

export default function PlayGame() {
  const path = usePathname();
  const gameAddr = path.split("/")[2] as `0x${string}`;

  const [toAdd, setToAdd] = useState<boolean>(false);

  const [indicesSelected, setIndicesSelected] = useState<Array<number>>([]);

  const [prePlayRoundArgs, setPrePlayRoundArgs] = useState<{
    count: string | undefined;
  }>({
    count: "5",
  });

  const [playRoundArgs, setPlayRoundArgs] = useState<{
    playerIndex: string | undefined;
    indicesArr: string | undefined;
  }>({
    playerIndex: undefined,
    indicesArr: undefined,
  });

  const [changeBetArgs, setChangeBetArgs] = useState<{
    playerIndex: string | undefined;
    toAdd: boolean | undefined;
    betAmount: string | undefined;
  }>({
    playerIndex: undefined,
    toAdd: undefined,
    betAmount: undefined,
  });

  const unWatchReq = useContractEvent({
    address: gameAddr,
    abi: abi,
    eventName: "RequestedUint256Array",
    listener(log) {
      const receivedReqId = log[0].args.requestId ?? "";
      console.log(`fired request : ${receivedReqId}`);
      unWatchReq?.();
    },
  });

  useContractEvent({
    address: gameAddr,
    abi: abi,
    eventName: "ReceivedUint256Array",
    listener(log) {
      const receivedReqId = log[0].args.requestId ?? "";
      console.log(`${receivedReqId} req is fulfilled`);
      // Call the actual play round here.
      callPlayRound();
    },
  });

  const { totalCountOfPlayers } = useGameStateReads(gameAddr);

  const { allPlayerDetails } = useGetAllPlayerDetails(
    gameAddr,
    parseInt(totalCountOfPlayers?.toString() ?? "0"),
  );

  const {
    config: changeBetConfig,
    error: changeBetError,
    isError: isChangeBetError,
  } = usePrepareContractWrite({
    address: gameAddr,
    abi,
    functionName: "changeBet",
    args: [
      BigInt(changeBetArgs.playerIndex ?? ""),
      changeBetArgs.toAdd ?? false,
    ],
    value: parseEther(changeBetArgs.betAmount ?? ""),
  });

  const { data: changeBetData, writeAsync: changeBetWriteAsync } =
    useContractWrite(changeBetConfig);

  const { isLoading: isChangeBetLoading } = useWaitForTransaction({
    hash: changeBetData?.hash,
  });

  const {
    config: prePlayConfig,
    error: prePlayError,
    isError: isPrePlayError,
  } = usePrepareContractWrite({
    address: gameAddr,
    abi,
    functionName: "prePlayRound",
    args: [BigInt(prePlayRoundArgs.count ?? "")],
  });

  const { data: prePlayData, writeAsync: prePlayWriteAsync } =
    useContractWrite(prePlayConfig);

  const { isLoading: isPrePlayLoading } = useWaitForTransaction({
    hash: prePlayData?.hash,
  });

  const {
    config: playRoundConfig,
    error: playRoundError,
    isError: isPlayRoundError,
  } = usePrepareContractWrite({
    address: gameAddr,
    abi,
    functionName: "playRound",
    args: [
      // BigInt(playRoundArgs.playerIndex ?? ""),
      BigInt(0),
      [BigInt(0), BigInt(1), BigInt(2), BigInt(3), BigInt(4)],
    ],
  });

  const { data: playRoundData, writeAsync: playRoundWriteAsync } =
    useContractWrite(playRoundConfig);

  const { isLoading: isPlayRoundLoading } = useWaitForTransaction({
    hash: playRoundData?.hash,
  });

  const callPlayRound = async () => {
    // TODO: Temp remove to check if random works
    // if (
    //   playRoundArgs.playerIndex == undefined ||
    //   playRoundArgs.indicesArr == undefined
    // ) {
    //   toast.error("Please enter the required args");
    //   return;
    // }

    const data = await playRoundWriteAsync?.();

    if (data?.hash) {
      toast.success(
        <div className="flex gap-2 justify-between">
          <div className="font-bold">Playing Round</div>
          <div className="text-sm text-slate-500 dark:text-slate-400 underline">
            <a target="_blank" href={fetchExplorerLink(data?.hash!, "tx")}>
              Explore Txn
            </a>
          </div>
        </div>,
      );
    } else {
      toast.error("something went wrong while playing round");
    }
  };

  const callPrePlay = async () => {
    if (!prePlayRoundArgs.count) {
      toast.error("Please enter the required args");
      return;
    }

    const data = await prePlayWriteAsync?.();

    if (data?.hash) {
      toast.success(
        <div className="flex gap-2 justify-between">
          <div className="font-bold">Requesting for random numbers</div>
          <div className="text-sm text-slate-500 dark:text-slate-400 underline">
            <a target="_blank" href={fetchExplorerLink(data?.hash!, "tx")}>
              Explore Txn
            </a>
          </div>
        </div>,
      );
    } else {
      toast.error("something went wrong while rolling dice");
    }
  };

  const callAdjustBet = async () => {
    if (
      !changeBetArgs.betAmount == undefined ||
      changeBetArgs.playerIndex == undefined ||
      changeBetArgs.toAdd == undefined
    ) {
      toast.error("Please enter the required args");
      return;
    }

    const data = await changeBetWriteAsync?.();

    if (data?.hash) {
      toast.success(
        <div className="flex gap-2 justify-between">
          <div className="font-bold">Bet placed</div>
          <div className="text-sm text-slate-500 dark:text-slate-400 underline">
            <a target="_blank" href={fetchExplorerLink(data?.hash!, "tx")}>
              Explore Txn
            </a>
          </div>
        </div>,
      );
    } else {
      toast.error("something went wrong while adjusting bet");
    }
  };

  const toggleSwitch = () => {
    setToAdd((state) => !state);
    setChangeBetArgs((state) => ({ ...state, toAdd: !toAdd }));
  };

  const selectDice = (e: any) => {
    const index = e.target.parentNode.getAttribute("data-keyid");
    console.log(`${index} selected`);
    if (index != null) {
      setIndicesSelected((state) =>
        state.includes(index)
          ? [...state.filter((s) => s !== index)]
          : [...state, index],
      );
    }
  };

  const nonZeroPlayers = allPlayerDetails?.filter(
    (p) => parseInt((p.result as any)?.playerAddr?.slice(2)) != 0,
  );

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
                    <div className="flex gap-4" onClick={selectDice}>
                      {hand.map((face, index) => (
                        <div key={face + Math.random()} data-keyid={index}>
                          {diceFaceToString(parseInt(face.toString()))}
                          {indicesSelected.includes(index) && <Check />}
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
                            setChangeBetArgs((state) => ({
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
                            {changeBetArgs.betAmount && (
                              <div className="flex gap-2">
                                <span className="text-sm text-slate-500 dark:text-slate-400">
                                  {toAdd ? "Adding" : "Reducing"}{" "}
                                  {changeBetArgs.betAmount}ETH
                                </span>
                                <span className="text-sm text-slate-500 dark:text-slate-400">
                                  New bet will be{" "}
                                  {/* TODO: Fix this calculation of new bet */}
                                  {toAdd
                                    ? parseFloat(bet) +
                                      parseFloat(changeBetArgs.betAmount)
                                    : parseFloat(bet) -
                                      parseFloat(changeBetArgs.betAmount)}
                                  ETH
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              disabled={!changeBetWriteAsync}
                              onClick={callAdjustBet}
                            >
                              {isChangeBetLoading
                                ? "Adjusting Bet"
                                : "Adjust Bet"}
                            </Button>
                            <Button
                              disabled={!prePlayWriteAsync}
                              onClick={callPrePlay}
                            >
                              {isPrePlayLoading || isPlayRoundLoading
                                ? "Rolling Dice"
                                : "Roll Dice"}
                              {indicesSelected.length != 0 &&
                                ` - ${indicesSelected.toString()}`}
                            </Button>
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
      {(isChangeBetError || changeBetError) && (
        <div>Error: {(changeBetError || changeBetError)?.message}</div>
      )}
      {(isPrePlayError || prePlayError) && (
        <div>Error: {(prePlayError || prePlayError)?.message}</div>
      )}
      {(isPlayRoundError || playRoundError) && (
        <div>Error: {(playRoundError || playRoundError)?.message}</div>
      )}
    </div>
  );
}
