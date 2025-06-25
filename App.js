import React, { useEffect, useState } from "react";
import Web3 from "web3";
import lotteryABI from "./LotteryABI.json";

// Replace this with your deployed contract address from Remix
const contractAddress = "0xYourDeployedContractAddressHere";

function App() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState("");
  const [lotteryContract, setLotteryContract] = useState(null);
  const [manager, setManager] = useState("");
  const [participants, setParticipants] = useState([]);
  const [balance, setBalance] = useState("");
  const [isManager, setIsManager] = useState(false);
  const [loading, setLoading] = useState(true);

  // This effect runs once when the component loads
  useEffect(() => {
    const init = async () => {
      try {
        // Check if MetaMask is installed
        if (window.ethereum) {
          const web3Instance = new Web3(window.ethereum);

          // Ask user to connect MetaMask
          await window.ethereum.request({ method: "eth_requestAccounts" });

          const accounts = await web3Instance.eth.getAccounts();
          const contract = new web3Instance.eth.Contract(lotteryABI, contractAddress);

          // Fetching on-chain data
          const managerAddr = await contract.methods.getManager().call();
          const players = await contract.methods.getParticipants().call();
          const contractBalance = await contract.methods.getBalance().call();

          // Setting up React state
          setWeb3(web3Instance);
          setAccount(accounts[0]);
          setLotteryContract(contract);
          setManager(managerAddr);
          setParticipants(players);
          setBalance(web3Instance.utils.fromWei(contractBalance, "ether"));
          setIsManager(accounts[0].toLowerCase() === managerAddr.toLowerCase());
        } else {
          alert("Please install MetaMask to use this DApp.");
        }
      } catch (err) {
        console.error("⚠️ Initialization failed:", err);
        alert("Something went wrong during Web3 initialization. Check the console.");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  // Function to enter the lottery (sends 1 ETH)
  const handleEnter = async () => {
    try {
      await lotteryContract.methods.enter().send({
        from: account,
        value: web3.utils.toWei("1", "ether"),
      });
      alert("✅ You have successfully entered the lottery!");
      window.location.reload(); // reload to update participants and balance
    } catch (err) {
      console.error("⚠️ Enter failed:", err);
      alert("Something went wrong while entering the lottery.");
    }
  };

  // Function for the manager to pick the winner
  const handlePickWinner = async () => {
    try {
      await lotteryContract.methods.pickWinner().send({ from: account });
      alert("🎉 A winner has been picked!");
      window.location.reload();
    } catch (err) {
      console.error("⚠️ Pick winner failed:", err);
      alert("Only the manager can pick a winner, or conditions weren't met.");
    }
  };

  if (loading) {
    return <h3 style={{ padding: "30px" }}>🔄 Loading smart contract...</h3>;
  }

  return (
    <div style={{ padding: "40px", fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "auto" }}>
      <h1>🎟️ Decentralized Lottery</h1>
      <p><strong>Connected Wallet:</strong> {account}</p>
      <p><strong>Contract Manager:</strong> {manager}</p>
      <p><strong>Number of Participants:</strong> {participants.length}</p>
      <p><strong>Current Pot:</strong> {balance} ETH</p>

      <div style={{ marginTop: "30px" }}>
        <button onClick={handleEnter} style={{ marginRight: "10px", padding: "10px 20px" }}>
          Enter Lottery (1 ETH)
        </button>

        {isManager && (
          <button onClick={handlePickWinner} style={{ padding: "10px 20px", backgroundColor: "#ff5252", color: "white" }}>
            Pick Winner
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
