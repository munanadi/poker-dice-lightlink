"use client";

import { diceFaceToString, fetchExplorerLink } from "@/libs/utils";
import { decodeErrorResult, formatEther, parseEther } from "viem";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { useLocalStorage } from "@uidotdev/usehooks";
import {
  useAccount,
  useContractEvent,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { abi } from "@/libs/abi";
import { useGameStateStore } from "@/store/useGameStore";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { usePathname } from "next/navigation";
import { usePlayerState } from "@/store/usePlayerState";

export default function PlayerComponent({
  playerAddr,
  bet,
  index,
  turn,
  hand: rawHand,
}: any) {
  const hand = rawHand.toString().split(",") as Array<number>;

  const isFirstRoll = hand.every((h) => h == 0);

  const pathName = usePathname();
  const gameAddrFromPathName =
    ((pathName?.split("/")?.[2] ?? "") as `0x${string}`) ?? undefined;

  const [toAdd, setToAdd] = useState<boolean>(false);

  const [requestArrArgs, setRequestArrArgs] = useState<`0x${string}`>(
    `0x65b6cDf104F9E0bf87de21C06b2dD77366cD2AfD0x65b6cDf104F9E0bf87de2C`,
  );

  const [prePlayRoundArgs, setPrePlayRoundArgs] = useState<{
    count: string | undefined;
  }>({
    count: isFirstRoll ? "5" : undefined,
  });

  const [playRoundArgs, setPlayRoundArgs] = useState<{
    playerIndex: string | undefined;
    indicesArr: Array<string> | undefined;
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

  const [args, saveArgs] = useLocalStorage<{
    playerIndex: string | undefined;
    indicesArr: Array<string> | undefined;
  }>("args", { playerIndex: undefined, indicesArr: undefined });

  const { address } = useAccount();

  const gameAddr =
    useGameStateStore((state) => state.gameAddress) ?? gameAddrFromPathName;

  // const unWatchReq = useContractEvent({
  //   address: gameAddr,
  //   abi: abi,
  //   eventName: "RequestedUint256Array",
  //   listener(log) {
  //     const receivedReqId = log[0].args.requestId ?? "";
  //     console.log(`fired request : ${receivedReqId}`);
  //     toast.info(`fired request : ${receivedReqId}`);
  //     unWatchReq?.();
  //   },
  // });

  // const unWatchReceived = useContractEvent({
  //   address: gameAddr,
  //   abi: abi,
  //   eventName: "ReceivedUint256Array",
  //   listener(log) {
  //     const receivedReqId = log[0].args.requestId ?? "";
  //     console.log(`${receivedReqId} req is fulfilled`);
  //     toast.info(`${receivedReqId} req is fulfilled`);
  //     // Call the actual play round here.
  //     // callPlayRound();
  //     unWatchReceived?.();
  //   },
  // });

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
    args: isFirstRoll ? [BigInt("5")] : [BigInt(prePlayRoundArgs.count ?? "")],
    // args: [BigInt("5")],
  });

  const { data: prePlayData, writeAsync: prePlayWriteAsync } =
    useContractWrite(prePlayConfig);

  const { isLoading: isPrePlayLoading } = useWaitForTransaction({
    hash: prePlayData?.hash,
  });

  const { playerIndex, indicesArr } = JSON.parse(
    localStorage.getItem("args") ?? '{"indicesArr": []}',
  );

  const newIndicesArr: [boolean, boolean, boolean, boolean, boolean] = [
    false,
    false,
    false,
    false,
    false,
  ];
  (indicesArr ?? []).forEach(
    (d: string) => (newIndicesArr[parseInt(d)] = true),
  );

  const {
    config: playRoundConfig,
    error: playRoundError,
    isError: isPlayRoundError,
    refetch: playRoundRefetch,
  } = usePrepareContractWrite({
    address: gameAddr,
    abi,
    functionName: "playRound",
    args: [
      BigInt(index),
      // [true, true, true, true, true],
      isFirstRoll ? [true, true, true, true, true] : (newIndicesArr as any),
    ],
    enabled: parseInt(turn ?? "-1") == 2 ? false : true,
  });

  const { data: playRoundData, writeAsync: playRoundWriteAsync } =
    useContractWrite(playRoundConfig);

  const { isLoading: isPlayRoundLoading } = useWaitForTransaction({
    hash: playRoundData?.hash,
  });

  const {
    data: requestArrData,
    error: requestArrError,
    refetch: requestArrRefetch,
  } = useContractRead({
    abi,
    address: gameAddr,
    functionName: "expectingRequestWithIdToBeFulfilled",
    args: [requestArrArgs],
    enabled: false,
  });

  const callPlayRound = async () => {
    const data = await playRoundRefetch();
    data.refetch();

    const { playerIndex, indicesArr } = JSON.parse(
      localStorage.getItem("args") ?? "{}",
    );

    if (playerIndex == undefined || indicesArr == undefined) {
      toast.error("Please enter the required args");
      return;
    }

    console.log({ playerIndex, indicesArr });
    console.log({ playRoundConfig });

    try {
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
        console.log(data);
        toast.error("something went wrong while playing round");
      }
    } catch (e) {
      console.log(e);
      return;
    }
  };

  const callPrePlay = async () => {
    if (!prePlayRoundArgs.count) {
      toast.error("Please enter the required args");
      return;
    }

    console.log({ prePlayConfig });

    try {
      const data = await prePlayWriteAsync?.();
      console.log("preplay round reqid ? ", { data });
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
        console.log(data);
        toast.error("something went wrong while rolling dice");
      }
    } catch (e) {
      console.log(e);
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
    let diceIndex = e.target.parentNode.getAttribute("data-keyid");
    let playerIndex =
      e.target.parentNode.parentNode.parentNode.children[0].children[0].getAttribute(
        "data-index",
      );

    if (diceIndex != null) {
      // console.log(`${diceIndex} selected from player ${playerIndex}`);
      diceIndex = diceIndex.toString();
      playerIndex = playerIndex.toString();

      const newIndicesArr = playRoundArgs.indicesArr?.includes(diceIndex)
        ? playRoundArgs.indicesArr?.filter((s) => s !== diceIndex)
        : playRoundArgs.indicesArr ?? [];

      setPrePlayRoundArgs({ count: (newIndicesArr.length + 1).toString() });

      setPlayRoundArgs((state) =>
        isFirstRoll
          ? { indicesArr: [0, 1, 2, 3, 4], playerIndex: playerIndex }
          : state.indicesArr?.includes(diceIndex)
          ? {
              indicesArr: [...newIndicesArr],
              playerIndex,
            }
          : {
              indicesArr: [...newIndicesArr, diceIndex],
              playerIndex,
            },
      );

      saveArgs({
        indicesArr: isFirstRoll
          ? [0, 1, 2, 3, 4]
          : newIndicesArr?.includes(diceIndex)
          ? [...newIndicesArr]
          : [...newIndicesArr, diceIndex],
        playerIndex: playerIndex,
      });
    }
  };

  return (
    <>
      <div
        key={playerAddr}
        className="flex flex-col items-center gap-2 justify-evenly"
      >
        <div className="flex gap-4">
          <div>
            <h2 data-index={index}>
              Player #{index} {playerAddr}
            </h2>
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
              <div
                key={face + Math.random()}
                data-keyid={index}
                className="flex flex-col items-center gap-2 "
              >
                {diceFaceToString(parseInt(face.toString()))}
                {playRoundArgs.indicesArr?.includes(index.toString()) && (
                  <Check />
                )}
              </div>
            ))}
          </div>
        </div>
        {address != playerAddr ? (
          <></>
        ) : parseInt(turn) < 2 ? (
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
                      <Button variant={"outline"} onClick={toggleSwitch}>
                        Add
                      </Button>
                    ) : (
                      <Button variant={"outline"} onClick={toggleSwitch}>
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
                      {isChangeBetLoading ? "Adjusting Bet" : "Adjust Bet"}
                    </Button>
                    <Button onClick={callPrePlay}>
                      {isFirstRoll
                        ? "First roll"
                        : (playRoundArgs.indicesArr ?? []).length == 0
                        ? "Select dice to roll"
                        : isPrePlayLoading || isPlayRoundLoading
                        ? "Rolling Dice"
                        : "Roll Dice"}
                      {(playRoundArgs.indicesArr ?? []).length != 0 &&
                        ` - ${playRoundArgs.indicesArr?.toString()}`}
                    </Button>
                    <Button onClick={callPlayRound}>Call Play Round</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-2xl text-bold">Your turns are over</div>
        )}
        {(isChangeBetError || changeBetError) && (
          <div>Error: {(changeBetError || changeBetError)?.message}</div>
        )}
        {(isPrePlayError || prePlayError) && (
          <div>Error: {(prePlayError || prePlayError)?.message}</div>
        )}
        {(isPlayRoundError || playRoundError) && parseInt(turn) != 2 && (
          <div>Error: {(playRoundError || playRoundError)?.message}</div>
        )}
      </div>
    </>
  );
}
