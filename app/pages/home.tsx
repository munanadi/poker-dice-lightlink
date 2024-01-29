import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useMoonSDK } from "../hooks/moon";
import { useEffect } from "react";

const NewHome: NextPage = () => {
  const { moon } = useMoonSDK();

  useEffect(() => {
    async function req() {
      const acc = await moon?.connect();
      console.log(acc);

      const chains = moon?.getNetworks();
      const pegasus = chains?.find(
        (c) => c.chainName == "Lightlink Pegasus Testnet",
      );

      console.log(pegasus);

      if (pegasus) {
        moon?.updateNetwork(pegasus);
      }

      // const r = await moon?.getAccountsSDK().createAccount({private_key: ""})
      // console.log(r)

      const listOfAccs = await moon?.getAccountsSDK().listAccounts()
      console.log(listOfAccs)
    }

    req();
  });

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1>New Home</h1>
      </main>
    </div>
  );
};

export default NewHome;
