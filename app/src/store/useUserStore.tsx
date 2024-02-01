import { create } from "zustand";

type State = {
  address: string;
};

type Action = {
  setAddress: (address: State["address"]) => void;
};

export const useCurrentUserStore = create<State & Action>((set) => ({
  address: "",
  setAddress: (address) => set(() => ({ address: address })),
}));
