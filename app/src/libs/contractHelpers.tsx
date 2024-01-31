import {
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
    ],
  });

  if (!data) {
    return {
      gameState: undefined,
      currentCountOfPlayers: undefined,
      totalCountOfPlayers: undefined,
      error,
    };
  }

  const gameState = data[0].result;
  const currentCountOfPlayers = data[1].result;
  const totalCountOfPlayers = data[2].result;

  return {
    gameState,
    currentCountOfPlayers,
    totalCountOfPlayers,
    error: undefined,
  };
};
