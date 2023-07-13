import { ethers } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";

export const bscTestRpc = {
  chainName: "bnbt",
  chainId: "0x61",
  nativeCurrency: {
    name: "BSC Testnet",
    decimals: 18,
    symbol: "BNB",
  },
  rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
};
/**
 * connect to metamask
 * @param {*} callabck after connected call this with accounts params
 */
export async function connectToMetaMask(callabck) {
  const provider = await detectEthereumProvider({ silent: true });
  if (provider) {
    const accounts = await provider.request({ method: "eth_accounts" });
    callabck(accounts);
    provider.once("accountsChanged", callabck);
  }
}
export async function switchToBscTest(callback) {
  const provider = await detectEthereumProvider({ silent: true });
  if (provider) {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: bscTestRpc.chainId }],
      });
    } catch (err) {
      // This error code indicates that the chain has not been added to MetaMask
      if (err.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [bscTestRpc],
        });
      }
    }
    provider.once("chainChanged", callback);
  }
}

export async function bindAccountChangeOnce() {
  function handleAccountsChanged(accounts) {
    // Handle new accounts, or lack thereof.
  }

  window.ethereum.on("accountsChanged", handleAccountsChanged);

  // Later

  window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
}
