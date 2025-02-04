
import React, { useState, useEffect, Children } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";
import axios from "axios";
import { useRouter } from "next/router";

//INTRNAL IMPORT
import { VotingAddress, VotingAddressABI } from './constants';

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

const fetchContract = (signerOrProvider) =>
    new ethers.Contract(VotingAddress, VotingAddressABI, signerOrProvider);

export const VotingContext = React.createContext();

export const VotingProvider = ({ children }) => {
    const votingTitle = "My first smart contact app";
    const router = useRouter();
    const [currentAccount, setCurrentAccount] = useState('');
    const [candidateLength, setCandidateLength] = useState('');
    const pushCandidate = [];
    const candidateIndex = [];
    const [candidateArray, setCandidateArray] = useState(pushCandidate);


    //---------------END OF CANDIDATE DATA--------------------

    const [error, setError] = useState('');
    const highestVote = [];


    //----------------VOTER SECTION-------------------

    const pushVoter = [];
    const [voterArray, setVoterArray] = useState(pushVoter);
    const [voterLength, setVoterLength] = useState('');
    const [voterAddress, setvoterAddress] = useState([]);



    //------------------CONNECTING METAMASK-----------------

    const checkIfWalletIsConnected = async () => {
        if (!window.ethereum) return setError("Please Install MetaMask");

        const account = await window.ethereum.request({ method: "eth_accounts" });

        if (account.length) {
            setCurrentAccount(account[0]);
        } else {
            setError("Please Install MetaMask & Connect, Reload");
        }
    };


    //-------------CONNECT WALLET------------

    const connectWallet = async () => {
        if (!window.ethereum) return setError("Please Install Metamask");

        const account = await window.ethereum.request({ method: "eth_requestAccounts", });

        setCurrentAccount(account[0]);
    };


    //----------UPLOAD TO IPFS VOTER IMAGE-----------

    const uploadToIPFS = async (file) => {
        try {
            const added = await client.add({ content: file });

            const url = `https://ipfs.infura.io/ipfs/${added.path}`;
            return url;

        } catch (error) {
            setError("Error Uploading file to IPFS");
        }
    };

    //----------UPLOAD TO IPFS CANDIDATE IMAGE-----------
    const uploadToIPFSCandidate = async (file) => {
        try {
            const added = await client.add({ content: file });

            const url = `https://ipfs.infura.io/ipfs/${added.path}`;
            return url;

        } catch (error) {
            setError("Error Uploading file to IPFS");
        }
    };

    //-------------------CREATE vOTER---------------
    const createVoter = async (formInput, fileUrl, router) => {
        try {
            const { name, address, position } = formInput;

            if (!name || !address || !position)
                return console.log("Input Data is Missing");


            //CONNECTING SMART CONTRACT
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const contract = fetchContract(signer);

            const data = JSON.stringify({ name, address, position, image: fileUrl });
            const added = await client.add(data);

            const url = `https://ipfs.infura.io/ipfs/${added.path}`;

            const voter = await contract.voterRight(address, name, url, fileUrl);
            voter.wait();



            router.push("/voterList");

        } catch (error) {
            setError("Something wrong creating voter");
        }
    };

    //-----------GET VOTER DATA
    const getAllVoterData = async () => {
        try {
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const contract = fetchContract(signer);

            //VOTER LIST
            const voterListData = await contract.getVoterList();
            setvoterAddress(voterListData);

            voterListData.map(async (eL) => {
                const singleVoterData = await contract.getVoterdata(eL);
                pushVoter.push(singleVoterData);
            });

            //VOTER LENGTH
            const voterList = await contract.getVoterLength();
            setVoterLength(voterList.toNumber());
        }
        catch (error) {
            setError("Something went wrong fetching data");
        }
    };


    //useEffect(() => {
    //    getAllVoterData();
    //}, []);


    //------GIVE VOTE
    const giveVote = async (id) => {
        try {
            const voterAddress = id.address;
            const voterid = id.id;
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const contract = fetchContract(signer);

            const voteredList = await contract.vote(voterAddress, voterid);
            console.log(voteredList);
        } catch (error) {
            console.log(error);
        }
    };


    //---------------CANDIDATE SECTION----------------------------
    const setCandidate = async (candidateForm, fileUrl, router) => {
        try {
            const { name, address, age } = candidateForm;

            if (!name || !address || !age)
                return setError("Input Data is Missing");

            console.log(name, address, age, fileUrl);


            //CONNECTING SMART CONTRACT
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const contract = fetchContract(signer);

            const data = JSON.stringify({ name, address, image: fileUrl, age });
            const added = await client.add(data);

            const ipfs = `https://ipfs.infura.io/ipfs/${added.path}`;

            const candidate = await contract.setCandidate(
                address,
                age,
                name,
                fileUrl,
                ipfs
            );
            candidate.wait();

            console.log(candidate);

            //router.push("/");
        } catch (error) {
            setError("Something wrong creating voter");
        }
    };


    //--------GET CANDIDATE DATA
    const getNewCandidate = async () => {
        try {
            //CONNECTING SMART CONTRACT
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const contract = fetchContract(signer);

            //-------------ALL CANDIDATE
            const allCandidate = await contract.getCandidate();


            allCandidate.map(async (eL) => {
                const singleCandidateData = await contract.getCandidatedata(eL);

                pushCandidate.push(singleCandidateData);
                candidateIndex.push(singleCandidateData[2].toNumber());
            });


            //-------------------CANDIDATE LENGTH
            const allCandidateLength = await contract.getCandidateLength();
            setCandidateLength(allCandidateLength.toNumber());

        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getNewCandidate();
        console.log(voterArray);
    }, []);


    return (
        <VotingContext.Provider
            value={{
                votingTitle,
                checkIfWalletIsConnected,
                connectWallet,
                uploadToIPFS,
                createVoter,
                getAllVoterData,
                giveVote,
                setCandidate,
                getNewCandidate,
                error,
                voterArray,
                voterLength,
                voterAddress,
                currentAccount,
                candidateLength,
                candidateArray,
                uploadToIPFSCandidate,
            }}
        >
            {children}
        </VotingContext.Provider>
    );
};

