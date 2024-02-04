"use client";

import { abi } from "@/libs/abi";
import { usePathname, useRouter } from "next/navigation";
import { useContractRead } from "wagmi";

export default function WinnerPage() {
  const pathName = usePathname();
  const gameAddr = pathName.split("/")?.[2] as `0x${string}`;

  const {
    data: winnerIndexData,
    error,
    isError,
  } = useContractRead({
    address: gameAddr,
    abi,
    functionName: "getWinnerIndex",
  });

  console.log({ winnerIndexData });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="container text-center">
        <h1 className="text-4xl font-bold mb-4 dark:text-white">
          Winner Page {winnerIndexData?.toString()}
        </h1>

        {/* Prepare Error */}
        {(isError || error) && <div>Error: {(error || error)?.message}</div>}
      </div>
    </div>
  );
}
