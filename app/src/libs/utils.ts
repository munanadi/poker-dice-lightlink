import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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

export function fetchExplorerLink(
  entity: string,
  type: "add" | "tx",
): string {
  switch (type) {
    case "add":
      return `https://mumbai.polygonscan.com/address/${entity}`;
    case "tx":
      return `https://mumbai.polygonscan.com/tx/${entity}`;
    default:
      return "";
  }
}
