import { create } from "zustand";

type Player = {
  playerIndex: string;
  indicesArr: Array<string>;
};

type State = {
  playerStates: Player[];
};

type Action = {
  setPlayerState: (playerStates: State) => void;
};

export const usePlayerState = create<State & Action>((set) => ({
  playerStates: [],
  setPlayerState: (playerStates) => set(() => ({ ...playerStates })),
}));
