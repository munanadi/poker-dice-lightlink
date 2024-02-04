"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useWaitForTransaction, useWalletClient } from "wagmi";
import { Address, Hash } from "viem";
import { abi } from "@/libs/abi";
import { bytecodeObject } from "@/libs/byteCode";
import { fetchParametersForChain } from "@/libs/networkHelperConfig";
import { fetchExplorerLink } from "@/libs/utils";

export default function StartGame() {
  const [numberOfPlayers, setNumberOfPlayers] = useState<number>(0);
  const [hash, setHash] = useState<Hash | undefined>(undefined);
  const [deployedAddr, setDeployedAddr] = useState<Address | null>(null);

  const { replace } = useRouter();

  const { data: walletClient } = useWalletClient();

  const { data: hashData, error: hashError } = useWaitForTransaction({
    hash,
    enabled: hash == undefined ? false : true,
  });

  useEffect(() => {
    if (hashError) {
      return;
    }

    if (hashData) {
      setDeployedAddr(hashData.contractAddress);
    }
  }, [hashData, hashError]);

  useEffect(() => {
    if (deployedAddr) {
      toast(`Game deployed at ${deployedAddr}`);
    }
  }, [deployedAddr]);

  const deployGame = async () => {
    if (!walletClient) {
      console.log("wallet client not found");
      return;
    }

    const chainId = walletClient.chain.id;

    const networkConfig = fetchParametersForChain(chainId);

    const bytecode = `${bytecodeObject.object}` as `0x${string}`;

    try {
      console.log(numberOfPlayers);
      const deployTxnHash = await walletClient?.deployContract({
        abi,
        bytecode,
        args: [
          BigInt(numberOfPlayers.toString()),
          networkConfig.airnodeRrpContractAddress,
        ],
      });

      if (deployTxnHash) {
        toast.success(
          <div className="flex gap-2 justify-between">
            <div className="font-bold">Trying to deploy a game</div>
            <div className="text-sm text-slate-500 dark:text-slate-400 underline">
              <a target="_blank" href={fetchExplorerLink(deployTxnHash!, "tx")}>
                Explore Txn
              </a>
            </div>
          </div>,
        );
      } else {
        console.log(deployTxnHash);
        toast.error("something went wrong while deploying game");
      }

      setHash(deployTxnHash);
    } catch (e) {
      toast.error("something went wrong deploying game");
    }
  };

  const goToGame = () => {
    replace(`/game/${deployedAddr}`);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          {!deployedAddr ? (
            <>
              <div className="mx-2">
                <Label htmlFor="number-of-players">Number Of Players</Label>
                <Input
                  type="text"
                  id="number-of-players"
                  placeholder="0"
                  onChange={(e) => setNumberOfPlayers(parseInt(e.target.value))}
                />
              </div>

              <Button onClick={deployGame}>Start Game</Button>
            </>
          ) : (
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4 dark:text-white">
                See game details
              </h1>
              <div className="text-xl mb-4 text-gray-700 dark:text-white">
                Remember to fund your sponsor wallet and set parameters.
                <div className="text-gray-500">
                  {" "}
                  (This will be soon automated)
                </div>
              </div>
              <Button onClick={goToGame}>Go</Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
