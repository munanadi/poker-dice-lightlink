import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  AceDice,
  JokerDice,
  KingDice,
  NineDice,
  QueenDice,
  TenDice,
  EmptyDice,
} from "@/components/DiceFaces";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function gameStateToString(
  state: number | undefined,
): string | undefined {
  switch (state) {
    // WaitingOnPlayersToJoin,
    case 0:
      return "Waiting on players to join!";
    // WaitingOnPlayerTurn,
    case 1:
      return "Waiting on palyers turn";
    // Started,
    case 2:
      return "Started";
    // FinishedRound
    case 3:
      return "Finished Round";
    default:
      return undefined;
  }
}

export function rankToString(state: number | undefined): string {
  switch (state) {
    // FiveOfAKind,
    case 0:
      return "Five of a kind";

    // FourOfAKind,
    case 1:
      return "Four of a kind";
    // FullHouse,
    case 2:
      return "Full house";

    // Straight,
    case 3:
      return "Straight";

    // ThreeOfAKind,
    case 4:
      return "Three of a kind";
    // TwoPair,
    case 5:
      return "Two pair";
    // Pair,
    case 6:
      "Pair";
    // Bust
    case 7:
      return "Bust";
    default:
      return "undefined";
  }
}

export function diceFaceToString(state: number | undefined): JSX.Element {
  switch (state) {
    // Ace,
    case 1:
      return AceDice();
    // King,
    case 2:
      return KingDice();
    // Queen,
    case 3:
      return QueenDice();
    // Jack
    case 4:
      return JokerDice();
    // 10
    case 5:
      return TenDice();
    // 9
    case 6:
      return NineDice();
    default:
      return EmptyDice();
  }
}

export const shortenAddressLink = (address: string): string => {
  return `${address.slice(0, 6)}.....${address.slice(-6, -1)}`;
};

export function fetchExplorerLink(entity: string, type: "add" | "tx"): string {
  switch (type) {
    case "add":
      return `https://mumbai.polygonscan.com/address/${entity}`;
    case "tx":
      return `https://mumbai.polygonscan.com/tx/${entity}`;
    default:
      return "";
  }
}
