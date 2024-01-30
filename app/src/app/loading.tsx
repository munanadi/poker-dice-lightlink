import { Loader2 } from "lucide-react";

export default function First() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Loader2 className="h-10 w-10 animate-spin" />
      <p>Get your bets ready!</p>
    </div>
  );
}
