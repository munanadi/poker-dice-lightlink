import { create } from "zustand";

type State = {
  currentCountOfPlayers: number | undefined;
  totalCountOfPlayers: number | undefined;
  totalBet: number | undefined;
  gameState: number | undefined;
  gameAddress: `0x${string}` | undefined;
};

type Action = {
  setGameState: (gameState: State) => void;
};

export const useGameStateStore = create<State & Action>((set) => ({
  currentCountOfPlayers: undefined,
  totalBet: undefined,
  totalCountOfPlayers: undefined,
  gameState: undefined,
  gameAddress: undefined,
  setGameState: (gameState: State) => set(() => ({ ...gameState })),
}));
