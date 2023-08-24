import detectEthereumProvider from '@metamask/detect-provider';
import { toast } from 'react-toastify';

export const TestRpc = {
  chainName: 'Mumbai',
  chainId: '0x13881',
  nativeCurrency: {
    name: 'MATIC',
    decimals: 18,
    symbol: 'MATIC'
  },
  rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
  blockExplorerUrls: ['https://mumbai.polygonscan.com']
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
export async function switchToTest() {
  const provider = await detectEthereumProvider();
  if (provider) {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: TestRpc.chainId }]
      });
    } catch (err) {
      // This error code indicates that the chain has not been added to MetaMask
      if (err.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [TestRpc]
        });
      }
    }
  }
}
