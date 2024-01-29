import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useMoonSDK } from "../hooks/moon";
import { useEffect, useState } from "react";

const SignIn: NextPage = () => {
  const { moon, initialize, disconnect } = useMoonSDK();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [walletAddress, setWalletAddress] = useState("");

  const handleLogin = async () => {
    try {
      // Check if Moon SDK is properly initialized and user is authenticated
      if (!moon) {
        console.error("User not authenticated");
        return;
      }

      const message = await moon.getAuthSDK().emailLogin({
        email,
        password,
      });
      const { token, refreshToken } = message.data;

      moon.updateToken(token);
      moon.updateRefreshToken(refreshToken);
    } catch (error) {
      console.error(error);
    }
  };

  // Use useEffect to initialize Moon SDK on component mount
  useEffect(() => {
    initialize();

    // Cleanup Moon SDK on component unmount
    return () => {
      disconnect();
    };
  }, []);

  useEffect(() => {
    initialize();
  }, []);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div>
          <h2>Login Moon Account</h2>
          <form>
            <label>
              Email:
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <br />
            <label>
              Password:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <button type="button" onClick={handleLogin}>
              Login
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default SignIn;
