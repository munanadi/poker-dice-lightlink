import {
  useContractRead,
  useContractReads,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

import { abi } from "@/libs/abi";

export const useJoinGame = (contractAdd: `0x${string}`) => {
  const { config, error, isError } = usePrepareContractWrite({
    address: contractAdd,
    abi: abi,
    functionName: "joinGame",
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
  });

  if (!data) {
    return {
      gameState: undefined,
      currentCountOfPlayers: undefined,
      totalCountOfPlayers: undefined,
      getTotalPrizePool: undefined,
      error,
    };
  }

  const gameState = data[0].result;
  const currentCountOfPlayers = data[1].result;
  const totalCountOfPlayers = data[2].result;
  const getTotalPrizePool = data[3].result;

  return {
    gameState,
    currentCountOfPlayers,
    totalCountOfPlayers,
    getTotalPrizePool,
    error: undefined,
  };
};
