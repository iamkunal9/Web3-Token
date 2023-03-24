import React, { createContext, useEffect, useState } from "react";
import * as jose from "jose";
export const AppContext = createContext();

const { ethereum } = typeof window !== "undefined" ? window : {};

const AppProvider = ({ children }) => {
  const [account, setAccount] = useState("");
  const [error, setError] = useState("");

  const checkEthereumExists = () => {
    if (!ethereum) {
      setError("Please Install MetaMask.");
      return false;
    }
    return true;
  };
  const getConnectedAccounts = async () => {
    setError("");
    try {
      const accounts = await ethereum.request({
        method: "eth_accounts",
      });
      console.log(accounts);
      setAccount(accounts[0]);
    } catch (err) {
      setError(err.message);
    }
  };
  const secret = new TextEncoder().encode(process.env.SECRET_TOKEN);
  async function generateAccessToken(waddress) {
    const alg = "HS256";
    const jwt = await new jose.SignJWT({ address: waddress })
      .setProtectedHeader({ alg })
      .setExpirationTime("2h")
      .sign(secret);
    return jwt;
  }
  const connectWallet = async () => {
    setError("");
    if (checkEthereumExists()) {
      try {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        console.log(accounts);
        setAccount(accounts[0]);
        var jwt = await generateAccessToken(accounts[0]);
    const response = await fetch("/api/add-to-db", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ jwt }),
    });
      } catch (err) {
        setError(err.message);
      }
    }
  };
  const disconnectWallet = async () => {
    setError("");
    if (account) {
        setAccount("");
    }
  };

  useEffect(() => {
    if (checkEthereumExists()) {
      ethereum.on("accountsChanged", getConnectedAccounts);
      getConnectedAccounts();
    }
    return () => {
      if (checkEthereumExists()) {
        ethereum.removeListener("accountsChanged", getConnectedAccounts);
      }
    };
  }, []);

  return (
    <AppContext.Provider value={{ account, connectWallet, error,disconnectWallet }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
