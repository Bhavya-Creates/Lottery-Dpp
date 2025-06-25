# Lottery-Dpp
A decentralized lottery system built using Solidity and React, deployed on the Ethereum Sepolia testnet.

Tech Stack
Solidity – Smart contract written in Solidity and deployed using Remix IDE

React.js – Frontend built with Create React App

Web3.js – Used for blockchain interaction from the frontend

MetaMask – Wallet integration for transactions

Sepolia Testnet – Contract deployed and tested on the Sepolia Ethereum test network

Smart Contract Features
Users can enter the lottery by sending exactly 1 ETH

A manager (contract creator) has special access to view the balance and pick a winner

A random winner is selected using keccak256 for pseudo-randomness

The entire contract balance is transferred to the winner and the participant list is reset

Frontend Features
Connect MetaMask wallet to interact with the smart contract

Displays the current manager's address, total players, and contract balance

Entry functionality with 1 ETH payment

"Pick Winner" button available only to the contract manager
