import React, { useEffect, useState, useCallback } from "react";
import { ethers } from "ethers";

// Smart contract address and ABI
const contractAddress = '0xA420Db6Af13FB8f67F5548f3a2910c08C7e863eD';
const contractABI = [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "approved", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": false, "internalType": "bool", "name": "approved", "type": "bool" }], "name": "ApprovalForAll", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "inputs": [], "name": "MAX_MINT_PER_TX", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "MAX_TOKENS", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "approve", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "baseExtension", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "baseUri", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "flipSaleState", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "getApproved", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "walletAddress", "type": "address" }], "name": "getMintedCount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "operator", "type": "address" }], "name": "isApprovedForAll", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "isSaleActive", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_numTokens", "type": "uint256" }], "name": "mint", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "ownerOf", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "price", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "operator", "type": "address" }, { "internalType": "bool", "name": "approved", "type": "bool" }], "name": "setApprovalForAll", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "_baseUri", "type": "string" }], "name": "setBaseUri", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_price", "type": "uint256" }], "name": "setPrice", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes4", "name": "interfaceId", "type": "bytes4" }], "name": "supportsInterface", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "tokenURI", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "transferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "withdrawAll", "outputs": [], "stateMutability": "payable", "type": "function" }];

const NFT = () => {
    const [contract, setContract] = useState(null);
    const [isSaleActive, setIsSaleActive] = useState(false);
    const [totalSupply, setTotalSupply] = useState(0);
    const [maxTokens, setMaxTokens] = useState(0);
    const [maxMintPerTx, setMaxMintPerTx] = useState(0);
    const [numTokensToMint, setNumTokensToMint] = useState(0);
    const [priceValue, setPriceValue] = useState(0); // Store Price in GWei
    const [wallet, setWallet] = useState([]);
    const [totalCost, setTotalCost] = useState(0);
    const [remainingPerAccount, setRemainingPerAccount] = useState(0);

    /**
     * Fetch contract data
     */
    const fetchContractData = useCallback(async () => {
        try {
            if (contract) {
                const saleActive = await contract.isSaleActive();
                const supply = await contract.totalSupply();
                const maxTokensValue = await contract.MAX_TOKENS();
                const maxMintPerTxValue = await contract.MAX_MINT_PER_TX();
                const priceVal = await contract.price(); // Retrieve the price value

                setIsSaleActive(saleActive);
                setTotalSupply(supply.toNumber());
                setMaxTokens(maxTokensValue.toNumber());
                setMaxMintPerTx(maxMintPerTxValue.toNumber());
                setPriceValue(priceVal);
                handleCalculateTotal();
            }
        } catch (err) {
            console.error(err);
        }
    }, [contract]);

    /**
     * Connect to MetaMask on component mount
     */
    useEffect(() => {
        const connectToMetaMask = async () => {
            if (wallet?.length) {
                try {
                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    const signer = provider.getSigner();
                    const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);
                    setContract(contractInstance);

                    // Fetch contract data
                    await fetchContractData();
                } catch (err) {
                    console.error(err);
                }
            }
        };

        connectToMetaMask();
    }, [wallet]);

    /**
     * Set Wallet Accounts using windows.ethereum
     */
    useEffect(() => {
        const ethereum = window.ethereum;
        try {
            if (ethereum) {
                ethereum
                    .request({ method: 'eth_chainId' })
                    .then((chainId) => {
                        // Use Chain Id as 0x61 for Binance Smart Chain Testnet
                        // or use Chain Id as 0x13881 for Mumbai testnet
                        if (chainId !== '0x61') {
                            alert('Please switch to Binance Smart Chain Testnet (BNB)');
                        } else {
                            try {
                                window.ethereum.request({ method: 'eth_requestAccounts' }).then((accs) => setWallet(accs));
                            } catch (e) {
                                console.log("Error fetching accounts");
                            }
                        }
                    })
                    .catch((error) => {
                        console.error('Error while checking blockchain:', error);
                    });
            } else {
                alert('Please install MetaMask extension to use this feature.');
            }
        } catch (e) {

        }

    }, [window.ethereum]);

    /**
     * Calculation of total price
     */
    const handleCalculateTotal = async () => {
        try {
            if (contract) {
                const mintedPerWallet = await contract.getMintedCount(
                    window.ethereum.selectedAddress
                );
                const remainingMint = maxMintPerTx - mintedPerWallet;
                setRemainingPerAccount(remainingMint);
                const numTokens = Math.min(remainingMint, numTokensToMint);
                setTotalCost(ethers.utils.formatEther(numTokens * priceValue));
            }
        } catch (e) {
            console.log("Error in handleCalculateTotal", e);
        }
    }

    /**
     * Perform Total Calculation if the numTokensToMint or maxMintPerTx are changed
     */
    useEffect(() => {
        handleCalculateTotal();
    }, [numTokensToMint, maxMintPerTx]);

    useEffect(() => {
        setInterval(() => {
            // polling every 5 seconds
            console.log("Refreshing data...");
            fetchContractData();
        }, 1000 * 5);
    }, []);


    /**
     * Call Mint function in contract
     */
    const handleMintTokens = async () => {
        try {
            if (contract && numTokensToMint > 0) {
                const mintedPerWallet = await contract.getMintedCount(
                    window.ethereum.selectedAddress
                );
                const remainingMint = maxMintPerTx - mintedPerWallet;
                const numTokens = Math.min(remainingMint, numTokensToMint);
                if (numTokens > 0) {
                    const mintTx = await contract.mint(numTokens, {
                        value: numTokens * priceValue,
                    });
                    await mintTx.wait();

                    // Refresh contract data
                    await fetchContractData();
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen h-full w-full overflow-hidden flex flex-col items-center justify-center background-image font-sans text-xl text-white duration-150" style={{ fontFamily: "Do Hyeon" }}>
            <img
                src="/images/BG_IMAGE.png"
                className="animate-pulse-slow absolute inset-auto block w-full min-h-screen object-cover"
            />
            <div className="flex justify-between w-11/12 z-10 absolute top-10">
                <span className="text-xl duration-200 hover:text-slate-300">
                    <a href="#">
                        ABOUT
                    </a>
                </span>
                <span className="text-2xl flex">
                    <img src="/images/LOGO_ICON.png" width="30" height="30" alt="GangClub-logo" />
                    GangClub
                </span>
                <div className="flex justify-between">
                    <a href="#">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px" fill="white">    <path d="M22,3.999c-0.78,0.463-2.345,1.094-3.265,1.276c-0.027,0.007-0.049,0.016-0.075,0.023c-0.813-0.802-1.927-1.299-3.16-1.299 c-2.485,0-4.5,2.015-4.5,4.5c0,0.131-0.011,0.372,0,0.5c-3.353,0-5.905-1.756-7.735-4c-0.199,0.5-0.286,1.29-0.286,2.032 c0,1.401,1.095,2.777,2.8,3.63c-0.314,0.081-0.66,0.139-1.02,0.139c-0.581,0-1.196-0.153-1.759-0.617c0,0.017,0,0.033,0,0.051 c0,1.958,2.078,3.291,3.926,3.662c-0.375,0.221-1.131,0.243-1.5,0.243c-0.26,0-1.18-0.119-1.426-0.165 c0.514,1.605,2.368,2.507,4.135,2.539c-1.382,1.084-2.341,1.486-5.171,1.486H2C3.788,19.145,6.065,20,8.347,20 C15.777,20,20,14.337,20,8.999c0-0.086-0.002-0.266-0.005-0.447C19.995,8.534,20,8.517,20,8.499c0-0.027-0.008-0.053-0.008-0.08 c-0.003-0.136-0.006-0.263-0.009-0.329c0.79-0.57,1.475-1.281,2.017-2.091c-0.725,0.322-1.503,0.538-2.32,0.636 C20.514,6.135,21.699,4.943,22,3.999z" /></svg>
                    </a>
                    <a href="#" className="ml-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0,0,256,256" width="24px" height="24px" fillRule="nonzero"><g fill="#ffffff" fillRule="nonzero" stroke="none" strokeWidth="1" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" strokeDasharray="" strokeDashoffset="0" fontFamily="none" fontWeight="none" fontSize="none" textAnchor="none" ><g transform="scale(10.66667,10.66667)"><path d="M14,11.02c-0.52,0 -0.94,0.53 -0.94,1.18c0,0.65 0.42,1.18 0.94,1.18c0.52,0 0.94,-0.53 0.94,-1.18c0,-0.65 -0.42,-1.18 -0.94,-1.18zM10,11.02c-0.52,0 -0.94,0.53 -0.94,1.18c0,0.65 0.42,1.18 0.94,1.18c0.52,0 0.94,-0.53 0.94,-1.18c0,-0.65 -0.42,-1.18 -0.94,-1.18zM14,11.02c-0.52,0 -0.94,0.53 -0.94,1.18c0,0.65 0.42,1.18 0.94,1.18c0.52,0 0.94,-0.53 0.94,-1.18c0,-0.65 -0.42,-1.18 -0.94,-1.18zM10,11.02c-0.52,0 -0.94,0.53 -0.94,1.18c0,0.65 0.42,1.18 0.94,1.18c0.52,0 0.94,-0.53 0.94,-1.18c0,-0.65 -0.42,-1.18 -0.94,-1.18zM18,3h-12c-1.66,0 -3,1.34 -3,3v12c0,1.66 1.34,3 3,3h11l-0.38,-1.41l3.01,3.03c0.51,0.51 1.37,0.15 1.37,-0.56v-16.06c0,-1.66 -1.34,-3 -3,-3zM17.57,14.74c-1.37,1.25 -3.16,1.26 -3.16,1.26l-0.43,-0.58c0.44,-0.15 0.82,-0.35 1.21,-0.65l-0.09,-0.24c-0.72,0.33 -1.65,0.53 -3.1,0.53c-1.45,0 -2.38,-0.2 -3.1,-0.53l-0.09,0.24c0.39,0.3 0.77,0.5 1.21,0.65l-0.43,0.58c0,0 -1.79,-0.01 -3.16,-1.26c-0.22,-0.2 -0.31,-0.51 -0.29,-0.8c0.25,-2.89 1.14,-4.64 1.46,-5.18c0.07,-0.13 0.17,-0.23 0.29,-0.32c0.38,-0.25 1.33,-0.81 2.5,-0.93l0.3,0.61c0.43,-0.08 0.9,-0.14 1.31,-0.14c0.4,0 0.86,0.06 1.31,0.14l0.3,-0.61c1.12,0.09 2.11,0.67 2.5,0.93c0.12,0.09 0.22,0.19 0.29,0.32c0.32,0.55 1.21,2.29 1.46,5.18c0.02,0.29 -0.07,0.6 -0.29,0.8zM14,11.02c-0.52,0 -0.94,0.53 -0.94,1.18c0,0.65 0.42,1.18 0.94,1.18c0.52,0 0.94,-0.53 0.94,-1.18c0,-0.65 -0.42,-1.18 -0.94,-1.18zM10,11.02c-0.52,0 -0.94,0.53 -0.94,1.18c0,0.65 0.42,1.18 0.94,1.18c0.52,0 0.94,-0.53 0.94,-1.18c0,-0.65 -0.42,-1.18 -0.94,-1.18z"></path></g></g></svg>                    </a>
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
                                            <span className="text-white">{maxTokens - totalSupply}</span> /{' '}
                                            {maxTokens}
                                        </p>
                                    </div>

                                    <img
                                        src="/images/NFT_IMAGE.png"
                                        className="object-cover w-full rounded-md"
                                    />
                                </div>

                                <div className="flex flex-col items-center w-full px-4 mt-16 md:mt-0">
                                    <div className="text-center">
                                        <h1 className="text-6xl text-red-500">{isSaleActive ? 'PUBLIC SALE' : 'SALE NOT STARTED'}</h1>

                                        <h3 className="text-sm text-white-200 tracking-widest">
                                            YOUR WALLET ADDRESS: {wallet?.length
                                                ? wallet[0].slice(0, 8) +
                                                '...' +
                                                wallet[0].slice(-4)
                                                : 'NONE'}
                                        </h3>
                                    </div>


                                    <div className="flex items-center justify-between w-full">

                                        <button
                                            className="w-10 h-10 md:w-14 md:h-14 flex items-center justify-center gradient-box font-bold rounded-md"
                                            onClick={() => setNumTokensToMint(Math.max(0, numTokensToMint - 1))}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-6 w-6 md:h-8 md:w-8"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M18 12H6"
                                                />
                                            </svg>
                                        </button>
                                        <p className="flex items-center justify-center flex-1 grow text-center font-bold text-brand-red text-3xl md:text-4xl">
                                            {numTokensToMint}
                                        </p>
                                        <button
                                            className="w-10 h-10 md:w-14 md:h-14 flex items-center justify-center font-bold rounded-md gradient-box"
                                            onClick={() => setNumTokensToMint(Math.min(remainingPerAccount, maxMintPerTx, numTokensToMint + 1))}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-6 w-6 md:h-8 md:w-8"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
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
                                        Remaining Mint Amount: {remainingPerAccount} / {maxMintPerTx}
                                    </p>

                                    <div className="mt-16 w-full">
                                        <div className="w-full text-xl flex items-center justify-between uppercase">
                                            <p>Total</p>

                                            <div className="flex items-center space-x-3">
                                                <p>
                                                    {totalCost}{' '}
                                                    ETH
                                                </p>{' '}
                                                <span className="text-gray-400">+ GAS</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mint Button && Connect Wallet Button */}
                                    {wallet && <button
                                        className={` ${!isSaleActive
                                            ? 'bg-red-500 cursor-not-allowed'
                                            : 'bg-red-500 duration-150 from-brand-purple to-brand-red shadow-lg hover:shadow-red-400/20 hover:bg-red-700'
                                            } mt-4 w-full px-6 py-3 rounded-md text-2xl text-white  mx-4 tracking-wide uppercase`}
                                        disabled={!isSaleActive}
                                        onClick={() => { handleMintTokens() }}
                                    >
                                        <p className="text-black">
                                            Mint
                                        </p>
                                    </button>}
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
