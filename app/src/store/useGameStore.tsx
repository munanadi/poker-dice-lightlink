import { create } from "zustand";

type State = {
  currentCountOfPlayers: number;
  totalCountOfPlayers: number;
  totalBet: number;
  gameState: number;
  gameAddress: `0x${string}`;
};

type Action = {
  setGameState: (gameState: State) => void;
};

export const useGameStateStore = create<State & Action>((set) => ({
  currentCountOfPlayers: 0,
  totalBet: 0,
  totalCountOfPlayers: 0,
  gameState: -1,
  gameAddress: "0x",
  setGameState: (gameState: State) => set(() => ({ ...gameState })),
}));
