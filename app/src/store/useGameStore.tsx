import { create } from "zustand";

type State = {
  currentCountOfPlayers: number;
  totalCountOfPlayers: number;
  totalBet: number;
  gameState: number;
};

type Action = {
  setGameState: (gameState: State) => void;
};

export const useGameStateStore = create<State & Action>((set) => ({
  currentCountOfPlayers: 0,
  totalBet: 0,
  totalCountOfPlayers: 0,
  gameState: -1,
  setGameState: (gameState: State) => set(() => ({ ...gameState })),
}));
