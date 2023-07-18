import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { ethers } from 'ethers';
import { contractAddress, contractABI } from './common/constants.js';
import { bscTestRpc, connectToMetaMask, switchToBscTest } from './common/connect-tools.js';
import Loading from './components/Loading.jsx';

const NFT = () => {
  /**
   * Fetch contract data
   */
  /**
   * collectionInfo:
   * |-isSaleActive boolean
   * |-supply number
   * |-maxTokensValue number
   * |-maxMintPerAccountValue number
   * |-price BigNumber
   *
   * myTokenInfo:
   * |-mintedAccount number
   */
  const { collectionInfo, myTokenInfo, fetchContractData, infoLoading } = useFetchData();

  const startApp = useCallback(async () => {
    // 1. fetch contract Data
    await fetchContractData();
  }, [fetchContractData]);

  // ============================== connect steps =================
  /**
   * Step 1. Connect to MetaMask set accounts to account state
   */
  const [accounts, setAccounts] = useState([]);
  useEffect(() => {
    connectToMetaMask(setAccounts);
  }, []);

  /**
   * Step 2. when the accounts not null, check current network, and switch
   * at the last, start app
   */
  const [currentNetworkId, setCurrentNetworkId] = useState();
  useEffect(() => {
    const checkAndSwitch = async () => {
      const currentChainId = await window.ethereum.request({
        method: 'eth_chainId'
      });
      setCurrentNetworkId(currentChainId);
      if (currentChainId === bscTestRpc.chainId) {
        // start app immde
        startApp();
      } else {
        switchToBscTest(() => {
          // after network changed startApp
          setCurrentNetworkId(bscTestRpc.chainId);
          startApp();
        }).catch((e) => {
          alert('please accept switch to bsc testnet, then refresh!');
        });
      }
    };
    if (accounts && accounts.length) {
      checkAndSwitch();
    }
  }, [accounts, startApp]);

  const [numsToMint, setNumsToMint] = useState(0);
  const addNums = useCallback(() => {
    setNumsToMint((num) => {
      return Math.min(collectionInfo.maxMintPerAccount, num + 1);
    }); // @Todo: there's a issue here, maybe total
  }, [collectionInfo.maxMintPerAccount]);
  const minusNums = useCallback(() => {
    setNumsToMint((num) => Math.max(0, num - 1));
  }, []);

  const [minting, setMinting] = useState(false);

  /**
   * Call Mint function in contract
   */
  const handleMintTokens = useCallback(async () => {
    if (numsToMint > 0) {
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = web3Provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      try {
        setMinting(true);
        const tx = await contract.mint(numsToMint, {
          value: collectionInfo.price.mul(numsToMint)
        });
        await tx.wait(1);
      } catch (e) {
        console.log(e);
      } finally {
        setMinting(false);
      }
    }
  }, [numsToMint]);

  /**
   * Calculation of total price
   */
  const totalCost = useMemo(() => {
    const total = collectionInfo.price.mul(numsToMint);
    return ethers.utils.formatEther(total);
  }, [numsToMint]);

  /**
   * Calculation of total price
   */
  const remainNumsForCurrent = useMemo(() => {
    const hasMinted = myTokenInfo.mintedAccount;
    console.log(collectionInfo.maxMintPerAccount, collectionInfo.maxMintPerAccount, hasMinted);
    return Math.min(collectionInfo.maxMintPerAccount, collectionInfo.maxMintPerAccount - hasMinted);
  }, [numsToMint, myTokenInfo.mintedAccount]);

  return (
    <div
      className="min-h-screen h-full w-full overflow-hidden flex flex-col items-center justify-center background-image font-sans text-xl text-white duration-150"
      style={{ fontFamily: 'Do Hyeon' }}>
      {infoLoading && <Loading />}
      <img
        alt="background"
        src="/images/BG_IMAGE.png"
        className="animate-pulse-slow absolute inset-auto block w-full min-h-screen object-cover"
      />
      <div className="flex justify-between w-11/12 z-10 absolute top-10">
        <span className="text-xl duration-200 hover:text-slate-300">
          <a href="jascript:void(0)">ABOUT</a>
        </span>
        <span className="text-2xl flex">
          <img src="/images/LOGO_ICON.png" width="30" height="30" alt="GangClub-logo" />
          GangClub
        </span>
        <div className="flex justify-between">
          <a href="jascript:void(0)">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24px"
              height="24px"
              fill="white">
              {' '}
              <path d="M22,3.999c-0.78,0.463-2.345,1.094-3.265,1.276c-0.027,0.007-0.049,0.016-0.075,0.023c-0.813-0.802-1.927-1.299-3.16-1.299 c-2.485,0-4.5,2.015-4.5,4.5c0,0.131-0.011,0.372,0,0.5c-3.353,0-5.905-1.756-7.735-4c-0.199,0.5-0.286,1.29-0.286,2.032 c0,1.401,1.095,2.777,2.8,3.63c-0.314,0.081-0.66,0.139-1.02,0.139c-0.581,0-1.196-0.153-1.759-0.617c0,0.017,0,0.033,0,0.051 c0,1.958,2.078,3.291,3.926,3.662c-0.375,0.221-1.131,0.243-1.5,0.243c-0.26,0-1.18-0.119-1.426-0.165 c0.514,1.605,2.368,2.507,4.135,2.539c-1.382,1.084-2.341,1.486-5.171,1.486H2C3.788,19.145,6.065,20,8.347,20 C15.777,20,20,14.337,20,8.999c0-0.086-0.002-0.266-0.005-0.447C19.995,8.534,20,8.517,20,8.499c0-0.027-0.008-0.053-0.008-0.08 c-0.003-0.136-0.006-0.263-0.009-0.329c0.79-0.57,1.475-1.281,2.017-2.091c-0.725,0.322-1.503,0.538-2.32,0.636 C20.514,6.135,21.699,4.943,22,3.999z" />
            </svg>
          </a>
          <a href="jascript:void(0)" className="ml-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0,0,256,256"
              width="24px"
              height="24px"
              fillRule="nonzero">
              <g
                fill="#ffffff"
                fillRule="nonzero"
                stroke="none"
                strokeWidth="1"
                strokeLinecap="butt"
                strokeLinejoin="miter"
                strokeMiterlimit="10"
                strokeDasharray=""
                strokeDashoffset="0"
                fontFamily="none"
                fontWeight="none"
                fontSize="none"
                textAnchor="none">
                <g transform="scale(10.66667,10.66667)">
                  <path d="M14,11.02c-0.52,0 -0.94,0.53 -0.94,1.18c0,0.65 0.42,1.18 0.94,1.18c0.52,0 0.94,-0.53 0.94,-1.18c0,-0.65 -0.42,-1.18 -0.94,-1.18zM10,11.02c-0.52,0 -0.94,0.53 -0.94,1.18c0,0.65 0.42,1.18 0.94,1.18c0.52,0 0.94,-0.53 0.94,-1.18c0,-0.65 -0.42,-1.18 -0.94,-1.18zM14,11.02c-0.52,0 -0.94,0.53 -0.94,1.18c0,0.65 0.42,1.18 0.94,1.18c0.52,0 0.94,-0.53 0.94,-1.18c0,-0.65 -0.42,-1.18 -0.94,-1.18zM10,11.02c-0.52,0 -0.94,0.53 -0.94,1.18c0,0.65 0.42,1.18 0.94,1.18c0.52,0 0.94,-0.53 0.94,-1.18c0,-0.65 -0.42,-1.18 -0.94,-1.18zM18,3h-12c-1.66,0 -3,1.34 -3,3v12c0,1.66 1.34,3 3,3h11l-0.38,-1.41l3.01,3.03c0.51,0.51 1.37,0.15 1.37,-0.56v-16.06c0,-1.66 -1.34,-3 -3,-3zM17.57,14.74c-1.37,1.25 -3.16,1.26 -3.16,1.26l-0.43,-0.58c0.44,-0.15 0.82,-0.35 1.21,-0.65l-0.09,-0.24c-0.72,0.33 -1.65,0.53 -3.1,0.53c-1.45,0 -2.38,-0.2 -3.1,-0.53l-0.09,0.24c0.39,0.3 0.77,0.5 1.21,0.65l-0.43,0.58c0,0 -1.79,-0.01 -3.16,-1.26c-0.22,-0.2 -0.31,-0.51 -0.29,-0.8c0.25,-2.89 1.14,-4.64 1.46,-5.18c0.07,-0.13 0.17,-0.23 0.29,-0.32c0.38,-0.25 1.33,-0.81 2.5,-0.93l0.3,0.61c0.43,-0.08 0.9,-0.14 1.31,-0.14c0.4,0 0.86,0.06 1.31,0.14l0.3,-0.61c1.12,0.09 2.11,0.67 2.5,0.93c0.12,0.09 0.22,0.19 0.29,0.32c0.32,0.55 1.21,2.29 1.46,5.18c0.02,0.29 -0.07,0.6 -0.29,0.8zM14,11.02c-0.52,0 -0.94,0.53 -0.94,1.18c0,0.65 0.42,1.18 0.94,1.18c0.52,0 0.94,-0.53 0.94,-1.18c0,-0.65 -0.42,-1.18 -0.94,-1.18zM10,11.02c-0.52,0 -0.94,0.53 -0.94,1.18c0,0.65 0.42,1.18 0.94,1.18c0.52,0 0.94,-0.53 0.94,-1.18c0,-0.65 -0.42,-1.18 -0.94,-1.18z"></path>
                </g>
              </g>
            </svg>{' '}
          </a>
        </div>
      </div>
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center h-full w-full px-2 md:px-10">
          <div className="rounded-md border-4 border-rose-600">
            <div className="z-1 md:max-w-3xl w-full bg-opacity-50 bg-gray-900 filter backdrop-blur-sm py-4 px-2 md:px-10 flex flex-col items-center border-2 border-gray-500">
              <div className="flex flex-col md:flex-row md:space-x-14 w-full mt-10 mb-4 md:mt-8">
                <div className="relative w-full">
                  <div className="z-10 absolute top-2 left-2 opacity-80 filter text-base px-4 py-2 bg-black border border-brand-white rounded-md flex items-center justify-center text-white font-semibold">
                    <p>
                      <span className="text-white">
                        {collectionInfo.maxTokens &&
                          collectionInfo.maxTokens - collectionInfo.totalSupply}
                      </span>{' '}
                      / {collectionInfo.maxTokens || 0}
                    </p>
                  </div>

                  <img
                    alt="NFT Sample"
                    src="/images/NFT_IMAGE.png"
                    className="object-cover w-full rounded-md"
                  />
                </div>

                <div className="flex flex-col items-center w-full px-4 mt-16 md:mt-0">
                  <div className="text-center">
                    <h1 className="text-6xl text-red-500">
                      {collectionInfo.isSaleActive ? 'PUBLIC SALE' : 'SALE NOT STARTED'}
                    </h1>

                    <h3 className="text-sm text-white-200 tracking-widest">
                      YOUR WALLET ADDRESS:{' '}
                      {accounts.length
                        ? accounts[0].slice(0, 8) + '...' + accounts[0].slice(-4)
                        : 'NONE'}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between w-full">
                    <button
                      className="w-10 h-10 md:w-14 md:h-14 flex items-center justify-center gradient-box font-bold rounded-md"
                      onClick={minusNums}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 md:h-8 md:w-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M18 12H6"
                        />
                      </svg>
                    </button>
                    <p className="flex items-center justify-center flex-1 grow text-center font-bold text-brand-red text-3xl md:text-4xl">
                      {numsToMint}
                    </p>
                    <button
                      className="w-10 h-10 md:w-14 md:h-14 flex items-center justify-center font-bold rounded-md gradient-box"
                      onClick={addNums}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 md:h-8 md:w-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </button>
                  </div>

                  <p className="text-sm tracking-widest mt-3 uppercase">
                    Remaining Mint Amount: {remainNumsForCurrent} /{' '}
                    {collectionInfo.maxMintPerAccount}
                  </p>

                  <div className="mt-16 w-full">
                    <div className="w-full text-xl flex items-center justify-between uppercase">
                      <p>Total</p>

                      <div className="flex items-center space-x-3">
                        <p>{totalCost} ETH</p> <span className="text-gray-400">+ GAS</span>
                      </div>
                    </div>
                  </div>

                  {/* Mint Button && Connect Wallet Button */}
                  {accounts && (
                    <button
                      className={` ${
                        !collectionInfo.isSaleActive || numsToMint === 0 || minting
                          ? 'bg-red-500 cursor-not-allowed'
                          : 'bg-red-500 duration-150 from-brand-purple to-brand-red shadow-lg hover:shadow-red-400/20 hover:bg-red-700'
                      } mt-4 w-full px-6 py-3 rounded-md text-2xl text-white  mx-4 tracking-wide uppercase`}
                      disabled={!collectionInfo.isSaleActive || numsToMint === 0 || minting}
                      onClick={handleMintTokens}>
                      {minting && (
                        <svg
                          aria-hidden="true"
                          className="inline w-6 h-6 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                          />
                        </svg>
                      )}
                      <span className="text-black">Mint</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFT;
function useFetchData() {
  const [collectionInfo, setCollectionInfo] = useState({
    isSaleActive: false,
    supply: 0,
    maxTokensValue: 0,
    maxMintPerAccount: 0,
    price: ethers.BigNumber.from(0)
  });
  const [myTokenInfo, setMyTokenInfo] = useState({ mintedAccount: 0 });
  const [infoLoading, setInfoLoading] = useState(true);
  const fetchContractData = useCallback(async () => {
    try {
      setInfoLoading(true);
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = web3Provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const isSaleActive = await contract.isSaleActive();
      const supply = await contract.totalSupply();
      const maxTokensValue = await contract.MAX_TOKENS();
      const maxMintPerAccount = await contract.MAX_MINT_PER_ACCOUNT();
      const price = await contract.price();
      setCollectionInfo({
        isSaleActive,
        supply: supply.toNumber(),
        maxTokensValue: maxTokensValue.toNumber(),
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
