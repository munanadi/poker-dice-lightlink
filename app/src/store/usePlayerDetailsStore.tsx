import { create } from "zustand";

type Player = {
  address: string;
  index: string;
  turn: string;
  bet: string;
  hand: Array<string>;
};

type State = {
  players: Array<Player> | undefined;
};

type Action = {
  setPlayers: (players: State["players"]) => void;
};

export const userPlayerDetailsStore = create<State & Action>((set) => ({
  players: undefined,
  setPlayers: (players) => set(() => ({ players: players })),
}));
