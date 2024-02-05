"use client";

import { Button } from "@/components/ui/button";
import { abi } from "@/libs/abi";
import { useGameStateReads } from "@/libs/contractHelpers";
import {
  diceFaceToString,
  rankToString,
  shortenAddressLink,
} from "@/libs/utils";
import { ArrowLeftIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useContractRead, useContractReads } from "wagmi";

export default function WinnerPage() {
  const pathName = usePathname();
  const gameAddr = pathName.split("/")?.[2] as `0x${string}`;

  const { replace, push } = useRouter();

  const [localData, setLocalData] = useState<any>([]);

  const { totalCountOfPlayers } = useGameStateReads(gameAddr);

  const gameContract = {
    address: gameAddr,
    abi: abi,
  } as const;

  const {
    data: winnerIndexData,
    error,
    isError,
  } = useContractRead({
    ...gameContract,
    functionName: "getWinnerIndex",
  });

  const playerIndexFetchArray = [];
  const playerRanksFetchArray = [];
  const playerDetailsFetchArray = [];

  for (let i = 0; i < parseInt(totalCountOfPlayers ?? "0"); i++) {
    playerIndexFetchArray.push({
      ...gameContract,
      functionName: "getPlayerIndexForIndex",
      args: [BigInt(i)],
    });
    playerRanksFetchArray.push({
      ...gameContract,
      functionName: "getPlayerRankForIndex",
      args: [BigInt(i)],
    });
    playerDetailsFetchArray.push({
      ...gameContract,
      functionName: "getPlayerDetails",
      args: [BigInt(i)],
    });
  }

  const { data: ranksData, error: ranksError } = useContractReads({
    contracts: [
      ...playerIndexFetchArray,
      ...playerRanksFetchArray,
      ...playerDetailsFetchArray,
    ],
  });

  // console.log({ ranksData });
  const allFetchOkay = ranksData?.every((d) => d.status == "success");

  useEffect(() => {
    setLocalData(ranksData?.map((d) => d.result));
  }, [allFetchOkay]);

  const playerRanks = ranksData?.slice(-4, -2) ?? [];
  const playerHands = localData?.slice(
    -parseInt(totalCountOfPlayers?.toString() ?? "-1"),
  );

  const winnerIndex = parseInt(winnerIndexData?.toString() ?? "-1");
  const winnderHandType = rankToString(
    parseInt((playerRanks[winnerIndex]?.result as any) ?? "".toString()),
  );
  const winnerHand = playerHands
    ?.find((p: any) => parseInt(p?.index?.toString()) == winnerIndex)
    ?.hand?.map((r: any) => parseInt(r.toString()));
  const winnerAddr = playerHands?.find(
    (p: any) => parseInt(p?.index?.toString()) == winnerIndex,
  )?.playerAddr;

  const goBack = () => {
    replace(`/game/${gameAddr}`);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="container text-center">
          <Button variant={"link"} onClick={goBack}>
            <ArrowLeftIcon className="mt-4" />
          </Button>
          <h1 className="text-4xl font-bold mb-4 dark:text-white">
            Winner Page
          </h1>
          <div className="text-2xl font-bold mb-4 dark:text-white">
            Player {shortenAddressLink(winnerAddr ?? "")} has won with{" "}
            {winnderHandType}
          </div>
          <div className="flex gap-2 justify-evenly">
            {winnerHand &&
              winnerHand?.map((face: any) => (
                <div
                  key={face + Math.random()}
                  className="flex flex-col items-center gap-2 "
                >
                  {diceFaceToString(parseInt(face.toString()))}
                </div>
              ))}
          </div>

          {/* Prepare Error */}
          {/* {(isError || error) && <div>Error: {(error || error)?.message}</div>} */}
        </div>
      </div>
    </>
  );
}
