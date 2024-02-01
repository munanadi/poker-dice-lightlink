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
import { useGetAllPlayerDetails, useJoinGame } from "@/libs/contractHelpers";
import { useAccount } from "wagmi";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useGameStateStore } from "@/store/useGameStore";
import { userPlayerDetailsStore } from "@/store/usePlayerDetailsStore";

export default function JoinGame({ params }: { params: { gameAddr: string } }) {
  const gameAddr = `0x${params.gameAddr.slice(2)}` as const;

  const { back, push } = useRouter();

  const { address } = useAccount();

  const { setPlayers } = userPlayerDetailsStore();

  const {
    callJoinData,
    callJoinGame,
    callJoinGameLoading,
    callJoinGameSuccess,
    callJoinIsPrepareError,
    callJoinPrepareError,
  } = useJoinGame(gameAddr);

  const { currentCountOfPlayers, gameState, totalBet, totalCountOfPlayers } =
    useGameStateStore();

  const { allPlayerDetails } = useGetAllPlayerDetails(
    gameAddr,
    parseInt(totalCountOfPlayers?.toString() || "0"),
  );

  // If this is -1, the current account is not playing this game
  const currentPlayerIndex = allPlayerDetails?.findIndex(
    (player) => (player?.result as any)?.playerAddr == address,
  );

  useEffect(() => {
    setPlayers(
      allPlayerDetails
        ?.filter((d) => parseInt((d.result as any).playerAddr?.slice(2)) != 0)
        ?.map((d) => d.result as any),
    );
  }, [gameAddr, totalCountOfPlayers]);

  useEffect(() => {
    if (currentPlayerIndex != -1) {
      push(`/game/${gameAddr}/play`);
      return;
    }
  }, [currentPlayerIndex]);

  useEffect(() => {
    if (callJoinGameSuccess) {
      toast.success(`Game joined!`, {
        description: fetchExplorerLink(callJoinData?.hash!, "tx"),
      });
    }
  }, [callJoinGameSuccess]);

  const joinGame = async () => {
    if (callJoinIsPrepareError) {
      toast.error("prepare contract for joingame error");
      return;
    }

    try {
      await callJoinGame?.();
    } catch (e: any) {
      console.log(e);
    }
  };

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
                    <div>{gameStateToString(gameState)}</div>
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
                    {/* TODO: Fetch this */}
                    <div className="font-semibold">Total bet:</div>
                    <div>{0}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* TODO: Fetch this */}
                    <div className="font-semibold">Entry Fee:</div>
                    <div>{0}</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex items-center gap-2">
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
                <Button disabled size="sm" variant="outline">
                  Spectate Game
                </Button>
              </CardFooter>
            </Card>
          </div>
          <div className="md:col-span-2 lg:col-span-3 xl:col-span-2 flex flex-col gap-6">
            <Card>
              <div>
                <CardHeader className="flex flex-row items-center space-y-0">
                  <CardTitle>Game Owner</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  {/* TODO:  */}
                  <div className="grid gap-1">Owner Addr goes here</div>
                </CardContent>
              </div>
              <Separator />
              <div>
                <CardHeader className="flex flex-row items-center space-y-0">
                  <CardTitle>Players in this game</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  {allPlayerDetails
                    ?.filter(
                      (p) =>
                        parseInt((p.result as any)?.playerAddr?.slice(2)) != 0,
                    )
                    .map((player, i) => (
                      <div key={(player?.result as any)?.playerAddr + i}>
                        <Link
                          className="grid gap-1 underline"
                          target="_blank"
                          href={fetchExplorerLink(
                            (player?.result as any)?.playerAddr,
                            "add",
                          )}
                        >
                          {shortenAddressLink(
                            (player?.result as any)?.playerAddr ?? "",
                          )}
                        </Link>
                      </div>
                    ))}
                </CardContent>
              </div>
            </Card>
          </div>
        </div>
      </main>

      {callJoinGameSuccess && (
        <div>
          Successfully Joined the game!
          <div>
            <a href={fetchExplorerLink(callJoinData?.hash!, "tx")}>Txn Link</a>
          </div>
        </div>
      )}

      {/* Prepare Error */}
      {(callJoinIsPrepareError || callJoinPrepareError) && (
        <div>
          Error: {(callJoinPrepareError || callJoinPrepareError)?.message}
        </div>
      )}
    </div>
  );
}
