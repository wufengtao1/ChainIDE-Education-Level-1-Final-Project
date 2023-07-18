import detectEthereumProvider from '@metamask/detect-provider';
import { toast } from 'react-toastify';

export const bscTestRpc = {
  chainName: 'bnbt',
  chainId: '0x61',
  nativeCurrency: {
    name: 'BSC Testnet',
    decimals: 18,
    symbol: 'BNB'
  },
  rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/']
};
/**
 * connect to metamask
 */
export async function connectToMetaMask() {
  const provider = await detectEthereumProvider();
  if (provider) {
    try {
      return await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
    } catch (e) {
      console.log(e);
      toast.error(e);
    }
  }
}
export async function switchToBscTest() {
  const provider = await detectEthereumProvider();
  if (provider) {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: bscTestRpc.chainId }]
      });
    } catch (err) {
      // This error code indicates that the chain has not been added to MetaMask
      if (err.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [bscTestRpc]
        });
      }
    }
  }
}
