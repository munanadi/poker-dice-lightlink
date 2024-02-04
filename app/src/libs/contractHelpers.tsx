import {
  useContractRead,
  useContractReads,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { parseEther } from "viem";

import { abi } from "@/libs/abi";
import { isAddress } from "ethers/lib/utils";

export const useJoinGame = (
  contractAdd: `0x${string}`,
  isGameAtCapacity: boolean,
  isCurrentAdressInGame: boolean,
) => {
  const { config, error, isError } = usePrepareContractWrite({
    address: contractAdd,
    abi: abi,
    functionName: "joinGame",
    enabled: isGameAtCapacity && isCurrentAdressInGame ? false : true,
  });

  const { data, writeAsync } = useContractWrite(config);
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return {
    callJoinData: data,
    callJoinGame: writeAsync,
    callJoinGameLoading: isLoading,
    callJoinGameSuccess: isSuccess,
    callJoinPrepareError: error,
    callJoinIsPrepareError: isError,
  };
};

export const useGetAllPlayerDetails = (
  contractAdd: `0x${string}`,
  count: number,
) => {
  const readObjs = [];

  for (let i = 0; i < count; i++) {
    const modifiedIndex = BigInt(i);
    readObjs.push({
      address: contractAdd,
      abi: abi,
      functionName: "getPlayerDetails",
      args: [modifiedIndex],
    });
  }

  const { data, error } = useContractReads({
    contracts: [...readObjs],
  });

  if (data && data.every((d) => d.status == "failure")) {
    return {
      allPlayerDetails: undefined,
      error: "no players yet",
    };
  }

  if (error) {
    return {
      allPlayerDetails: undefined,
      error,
    };
  }

  return {
    allPlayerDetails: data,
    error: undefined,
  };
};

export const useGameStateReads = (contractAdd: `0x${string}`) => {
  let gameState: string | undefined = undefined;
  let currentCountOfPlayers: string | undefined = undefined;
  let totalCountOfPlayers: string | undefined = undefined;
  let getTotalPrizePool: string | undefined = undefined;

  const gameContract = {
    address: contractAdd,
    abi: abi,
  } as const;

  const { data, error } = useContractReads({
    contracts: [
      {
        ...gameContract,
        functionName: "getGameState",
      },
      {
        ...gameContract,
        functionName: "getCurrentCountOfPlayers",
      },
      {
        ...gameContract,
        functionName: "getTotalNumberOfPlayers",
      },
      {
        ...gameContract,
        functionName: "getTotalPrizePool",
      },
    ],
    enabled:
      contractAdd == "0x" ||
      contractAdd == ("" as string) ||
      !isAddress(contractAdd)
        ? false
        : true,
  });

  if (
    contractAdd == "0x" ||
    contractAdd == ("" as string) ||
    !isAddress(contractAdd)
  ) {
    return {
      gameState,
      currentCountOfPlayers,
      totalCountOfPlayers,
      getTotalPrizePool,
      error: "enter valid address",
    };
  }

  if (data && data.every((d) => d.status == "failure")) {
    // All fetches failed, cannot be a game.
    return {
      gameState: undefined,
      currentCountOfPlayers: undefined,
      totalCountOfPlayers: undefined,
      getTotalPrizePool: undefined,
      error: "not a game",
    };
  } else if (error) {
    return {
      gameState: undefined,
      currentCountOfPlayers: undefined,
      totalCountOfPlayers: undefined,
      getTotalPrizePool: undefined,
      error,
    };
  } else if (data && data.every((d) => d.status == "success")) {
    gameState = (data[0].result ?? "").toString();
    currentCountOfPlayers = (data[1].result ?? "").toString();
    totalCountOfPlayers = (data[2].result ?? "").toString();
    getTotalPrizePool = (data[3].result ?? "").toString();
  }

  return {
    gameState,
    currentCountOfPlayers,
    totalCountOfPlayers,
    getTotalPrizePool,
    error: undefined,
  };
};
