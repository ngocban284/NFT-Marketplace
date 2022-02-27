import Web3 from "web3";

const web3 = window.ethereum ? new Web3(window.ethereum) : null;

export default web3;