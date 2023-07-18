import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { contractAddress, contractABI } from './constants.js';
/**
 * collectionInfo:
 * |-isSaleActive boolean
 * |-totalSupply number
 * |-maxTokens number
 * |-maxMintPerAccountValue number
 * |-price BigNumber
 *
 * myTokenInfo:
 * |-mintedAccount number
 */
export function useFetchData() {
  const [collectionInfo, setCollectionInfo] = useState({
    isSaleActive: false,
    totalSupply: 0,
    maxTokens: 0,
    maxMintPerAccount: 0,
    price: ethers.BigNumber.from(0)
  });
  const [myTokenInfo, setMyTokenInfo] = useState({ mintedAccount: 0 });
  const [infoLoading, setInfoLoading] = useState(false);
  const fetchContractData = useCallback(async () => {
    try {
      setInfoLoading(true);
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = web3Provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const isSaleActive = await contract.isSaleActive();
      const totalSupply = await contract.totalSupply();
      const maxTokens = await contract.MAX_TOKENS();
      const maxMintPerAccount = await contract.MAX_MINT_PER_ACCOUNT();
      const price = await contract.price();
      setCollectionInfo({
        isSaleActive,
        totalSupply: totalSupply.toNumber(),
        maxTokens: maxTokens.toNumber(),
        maxMintPerAccount: maxMintPerAccount.toNumber(),
        price: price
      });

      const myAddress = signer.getAddress();
      const mintedAccount = await contract.getMintedCount(myAddress);
      setMyTokenInfo({ mintedAccount });
    } catch (e) {
      console.log(e);
    } finally {
      setInfoLoading(false);
    }
  }, []);

  return { collectionInfo, myTokenInfo, infoLoading, fetchContractData };
}
