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
            } else {
                console.error('MetaMask extension not detected');
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
        try{
            if (contract) {
                const mintedPerWallet = await contract.getMintedCount(
                    window.ethereum.selectedAddress
                );
                const remainingMint = maxMintPerTx - mintedPerWallet;
                setRemainingPerAccount(remainingMint);
                const numTokens = Math.min(remainingMint, numTokensToMint);
                setTotalCost(ethers.utils.formatEther(numTokens * priceValue));
            }
        }catch(e){
            console.log("Error in handleCalculateTotal", e);
        }
    }

    /**
     * Perform Total Calculation if the numTokensToMint or maxMintPerTx are changed
     */
    useEffect(() => {
        handleCalculateTotal();
    }, [numTokensToMint, maxMintPerTx]);


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
        <div className="min-h-screen h-full w-full overflow-hidden flex flex-col items-center justify-center bg-brand-background font-sans text-xl text-white duration-150" style={{ fontFamily: "Featuristic" }}>
            <div className="flex justify-between w-11/12 z-10 absolute top-10">
                <span className="text-xl duration-200 hover:text-slate-300">
                    <a href="#">
                        ABOUT
                    </a>
                </span>
                <span className="text-2xl underline underline-offset-8">
                    😈 GANG NFT
                </span>
                <div className="flex justify-between">
                    <a href="#">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px" fill="white">    <path d="M22,3.999c-0.78,0.463-2.345,1.094-3.265,1.276c-0.027,0.007-0.049,0.016-0.075,0.023c-0.813-0.802-1.927-1.299-3.16-1.299 c-2.485,0-4.5,2.015-4.5,4.5c0,0.131-0.011,0.372,0,0.5c-3.353,0-5.905-1.756-7.735-4c-0.199,0.5-0.286,1.29-0.286,2.032 c0,1.401,1.095,2.777,2.8,3.63c-0.314,0.081-0.66,0.139-1.02,0.139c-0.581,0-1.196-0.153-1.759-0.617c0,0.017,0,0.033,0,0.051 c0,1.958,2.078,3.291,3.926,3.662c-0.375,0.221-1.131,0.243-1.5,0.243c-0.26,0-1.18-0.119-1.426-0.165 c0.514,1.605,2.368,2.507,4.135,2.539c-1.382,1.084-2.341,1.486-5.171,1.486H2C3.788,19.145,6.065,20,8.347,20 C15.777,20,20,14.337,20,8.999c0-0.086-0.002-0.266-0.005-0.447C19.995,8.534,20,8.517,20,8.499c0-0.027-0.008-0.053-0.008-0.08 c-0.003-0.136-0.006-0.263-0.009-0.329c0.79-0.57,1.475-1.281,2.017-2.091c-0.725,0.322-1.503,0.538-2.32,0.636 C20.514,6.135,21.699,4.943,22,3.999z" /></svg>
                    </a>
                    <a href="#">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px" fill="white">    <path d="M 8 3 C 5.239 3 3 5.239 3 8 L 3 16 C 3 18.761 5.239 21 8 21 L 16 21 C 18.761 21 21 18.761 21 16 L 21 8 C 21 5.239 18.761 3 16 3 L 8 3 z M 18 5 C 18.552 5 19 5.448 19 6 C 19 6.552 18.552 7 18 7 C 17.448 7 17 6.552 17 6 C 17 5.448 17.448 5 18 5 z M 12 7 C 14.761 7 17 9.239 17 12 C 17 14.761 14.761 17 12 17 C 9.239 17 7 14.761 7 12 C 7 9.239 9.239 7 12 7 z M 12 9 A 3 3 0 0 0 9 12 A 3 3 0 0 0 12 15 A 3 3 0 0 0 15 12 A 3 3 0 0 0 12 9 z" /></svg>
                    </a>
                </div>
            </div>
            <div className="relative w-full h-full flex flex-col items-center justify-center">
                <img
                    src="/images/blur.jpeg"
                    className="animate-pulse-slow absolute inset-auto block w-full min-h-screen object-cover"
                />
                <div className="flex flex-col items-center justify-center h-full w-full px-2 md:px-10">

                    <div className="relative z-1 md:max-w-3xl w-full bg-gray-900/90 filter backdrop-blur-sm py-4 rounded-md px-2 md:px-10 flex flex-col items-center border-2 border-rose-600">
                        <h1 className="text-6xl text-emerald-400">{isSaleActive ? 'PUBLIC SALE' : 'SALE NOT STARTED'}</h1>

                        <h3 className="text-sm text-pink-200 tracking-widest">
                            YOUR WALLET ADDRESS: {wallet?.length
                                ? wallet[0].slice(0, 8) +
                                '...' +
                                wallet[0].slice(-4)
                                : 'NONE'}
                        </h3>


                        <div className="flex flex-col md:flex-row md:space-x-14 w-full mt-10 md:mt-14">
                            <div className="relative w-full">
                                <div className="font-coiny z-10 absolute top-2 left-2 opacity-80 filter backdrop-blur-lg text-base px-4 py-2 bg-black border border-brand-purple rounded-md flex items-center justify-center text-white font-semibold">
                                    <p>
                                        <span className="text-white">{totalSupply}</span> /{' '}
                                        {maxTokens}
                                    </p>
                                </div>

                                <img
                                    src="/images/13.png"
                                    className="object-cover w-full sm:h-[280px] md:w-[250px] rounded-md"
                                />
                            </div>

                            <div className="flex flex-col items-center w-full px-4 mt-16 md:mt-0">
                                <div className="font-coiny flex items-center justify-between w-full">
                                    <button
                                        className="w-14 h-10 md:w-16 md:h-12 flex items-center justify-center text-brand-background hover:shadow-lg bg-gray-300 hover:bg-gray-100 font-bold rounded-md"
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

                                    <p className="flex items-center justify-center flex-1 grow text-center font-bold text-brand-pink text-3xl md:text-4xl">
                                        {numTokensToMint}
                                    </p>

                                    <button
                                        className="w-14 h-10 md:w-16 md:h-12 flex items-center justify-center text-brand-background hover:shadow-lg hover:bg-gray-100 bg-gray-300 font-bold rounded-md"
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
                                </div>

                                <p className="text-sm text-pink-200 tracking-widest mt-3">
                                    Remaining Mint Amount: {remainingPerAccount} / {maxMintPerTx}
                                </p>

                                <div className="border-t border-b py-4 mt-16 w-full">
                                    <div className="w-full text-xl font-coiny flex items-center justify-between text-brand-yellow">
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
                                        ? 'bg-pink-500 cursor-not-allowed'
                                        : 'bg-pink-500 duration-150 from-brand-purple to-brand-pink shadow-lg hover:shadow-pink-400/20 hover:bg-pink-700'
                                        } font-coiny mt-12 w-full px-6 py-3 rounded-md text-2xl text-white  mx-4 tracking-wide uppercase`}
                                    disabled={!isSaleActive}
                                    onClick={() => { handleMintTokens() }}
                                >
                                    Mint
                                </button>}
                            </div>


                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NFT;
