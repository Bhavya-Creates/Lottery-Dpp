// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.26;

contract Lottery {
    address public manager;
    address payable[] public participants;

    constructor() {
        manager = msg.sender;
    }

    function enter() public payable {
        require(msg.value == 1 ether, "Must send exactly 1 ETH to enter");
        participants.push(payable(msg.sender));
    }

    function getBalance() public view returns (uint) {
        require(msg.sender == manager, "Only manager can view balance");
        return address(this).balance;
    }

    function getParticipants() public view returns (address payable[] memory) {
        return participants;
    }

    function getPlayerCount() public view returns (uint) {
        return participants.length;
    }

    function getManager() public view returns (address) {
        return manager;
    }

    function getRandomNumber() internal view returns (uint) {
        // Using block.prevrandao (formerly block.difficulty) is discouraged for randomness
        // as it can be manipulated by miners. For production, consider Chainlink VRF or similar.
        return uint(keccak256(abi.encodePacked(block.prevrandao, block.timestamp, participants.length)));
    }

    function pickWinner() public {
        require(msg.sender == manager, "Only manager can pick winner");
        require(participants.length >= 3, "At least 3 players required");

        uint index = getRandomNumber() % participants.length;
        address payable winner = participants[index];

        // Transfer the entire contract balance to the winner
        // It's good practice to check if the transfer was successful
        (bool sent, ) = winner.call{value: address(this).balance}("");
        require(sent, "Failed to send Ether to winner");

        // Reset participants list
        // Option 1: Assign an empty array literal
        participants = new address payable[](0);
        // Option 2: Use delete (also effective)
        // delete participants;
    }
}