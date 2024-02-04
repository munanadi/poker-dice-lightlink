"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  fetchExplorerLink,
  gameStateToString,
  shortenAddressLink,
} from "@/libs/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeftIcon, Loader2 } from "lucide-react";
import { useEffect } from "react";
import {
  useGameStateReads,
  useGetAllPlayerDetails,
  useJoinGame,
} from "@/libs/contractHelpers";
import { useAccount } from "wagmi";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useGameStateStore } from "@/store/useGameStore";
import { userPlayerDetailsStore } from "@/store/usePlayerDetailsStore";
import { parseAbiParameter } from "viem";

export default function JoinGame({ params }: { params: { gameAddr: string } }) {
  const gameAddr = `0x${params.gameAddr.slice(2)}` as const;

  const { back, push } = useRouter();

  const { address } = useAccount();

  const { setPlayers } = userPlayerDetailsStore();

  const {
    currentCountOfPlayers,
    error: gameStateError,
    gameState,
    getTotalPrizePool,
    totalCountOfPlayers,
  } = useGameStateReads(gameAddr);

  const isGameAtCapacity =
    parseInt(currentCountOfPlayers ?? "0") ==
    parseInt(totalCountOfPlayers ?? "1");

  const {
    callJoinData,
    callJoinGame,
    callJoinGameLoading,
    callJoinGameSuccess,
    callJoinIsPrepareError,
    callJoinPrepareError,
  } = useJoinGame(gameAddr, isGameAtCapacity);

  const { allPlayerDetails, error } = useGetAllPlayerDetails(
    gameAddr,
    parseInt(totalCountOfPlayers?.toString() || "0"),
  );

  const playerDetails = error == "no players yet" ? [] : allPlayerDetails;

  // If this is -1, the current account is not playing this game
  const isCurrentAdressInGame =
    (playerDetails ?? []).findIndex(
      (player) => (player?.result as any)?.playerAddr == address,
    ) != -1;

  useEffect(() => {
    const nonZeroPlayers = (playerDetails ?? [])?.filter(
      (d) => parseInt((d.result as any)?.playerAddr?.slice(2)) != 0,
    );

    const players = nonZeroPlayers?.map((d) => d?.result as any);

    setPlayers(players);
  }, [gameAddr, totalCountOfPlayers, allPlayerDetails]);

  const joinGame = async () => {
    console.log("join game function was called.");
    if (callJoinIsPrepareError) {
      toast.error("prepare contract for joingame error");
      return;
    }

    try {
      const data = await callJoinGame?.();

      if (data?.hash) {
        toast.success(
          <div className="flex gap-2 justify-between">
            <div className="font-bold">Joining Game</div>
            <div className="text-sm text-slate-500 dark:text-slate-400 underline">
              <a target="_blank" href={fetchExplorerLink(data?.hash!, "tx")}>
                Explore Txn
              </a>
            </div>
          </div>,
        );
      } else {
        console.log(data);
        toast.error("something went wrong while joining game");
      }
    } catch (e: any) {
      console.log(e);
    }
  };

  const takeToPlayScreen = () => {
    push(`/game/${gameAddr}/play`);
    return;
  };

  const nonZeroPlayers: any = (playerDetails ?? [])?.filter(
    (d) => parseInt((d.result as any)?.playerAddr?.slice(2)) != 0,
  );

  const players =
    nonZeroPlayers.length != 0
      ? nonZeroPlayers?.map((d: any) => d?.result as any)
      : [];

  return (
    <div className="container">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex items-center gap-4">
          <Button size="icon" variant="outline" onClick={() => back()}>
            <ArrowLeftIcon />
            <span className="sr-only">Back</span>
          </Button>
        </div>
        <div className="flex flex-col md:grid md:grid-cols-6 gap-6">
          <div className="md:col-span-4 lg:col-span-3 xl:col-span-4 flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  Game Details
                  <p className="mt-1 underline">
                    <Link
                      href={fetchExplorerLink(gameAddr, "add")}
                      target="_blank"
                    >
                      {gameAddr}
                    </Link>
                  </p>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold">Game State:</div>
                    <div>{gameStateToString(parseInt(gameState!))}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="font-semibold">Players Joined:</div>
                    <div>{currentCountOfPlayers?.toString()}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="font-semibold">Total players:</div>
                    <div>{totalCountOfPlayers?.toString()}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="font-semibold">Total bet:</div>
                    <div>{getTotalPrizePool?.toString()}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* TODO: Fetch this */}
                    <div className="font-semibold">Entry Fee:</div>
                    <div>{0}</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex items-center gap-2">
                {isCurrentAdressInGame ? (
                  <Button onClick={takeToPlayScreen}>Play!</Button>
                ) : isGameAtCapacity ? (
                  <Button variant={"destructive"} disabled>
                    Game Full!
                  </Button>
                ) : (
                  <Button size="sm" onClick={joinGame}>
                    {!callJoinGameLoading ? (
                      "Join Game"
                    ) : (
                      <>
                        <Loader2 className="h-10 w-10 animate-spin" />
                        <p>Joining Game</p>
                      </>
                    )}
                  </Button>
                )}
                <Button
                  disabled
                  size="sm"
                  className="cursor-not-allowed"
                  variant="outline"
                >
                  Spectate Game
                </Button>
              </CardFooter>
            </Card>
          </div>
          <div className="md:col-span-2 lg:col-span-3 xl:col-span-2 flex flex-col gap-6">
            <Card>
              <div>
                <CardHeader className="flex flex-row items-center space-y-0">
                  <CardTitle>Players in this game</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  {players?.length == 0 ? (
                    <div className="text-md text-gray-400">
                      Players are yet to join!
                    </div>
                  ) : (
                    players?.map((player: any, i: number) => (
                      <div key={(player as any)?.playerAddr}>
                        <Link
                          className="grid gap-1 underline"
                          target="_blank"
                          href={fetchExplorerLink(
                            (player as any)?.playerAddr,
                            "add",
                          )}
                        >
                          {shortenAddressLink(
                            (player as any)?.playerAddr ?? "",
                          )}
                        </Link>
                      </div>
                    ))
                  )}
                </CardContent>
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Prepare Error */}
      {(callJoinIsPrepareError || callJoinPrepareError) &&
        !isGameAtCapacity && (
          <div>
            Error: {(callJoinPrepareError || callJoinPrepareError)?.message}
          </div>
        )}
    </div>
  );
}
