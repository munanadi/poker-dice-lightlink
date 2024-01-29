import { Button } from "@/components/ui/button";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function First() {
  return (
    <div className="text-center mx-auto flex items-center">
      <div>
        <main>
          <ConnectButton />
        </main>
      </div>
    </div>
  );
}
