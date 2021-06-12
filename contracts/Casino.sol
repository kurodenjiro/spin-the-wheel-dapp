// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Casino {
  event WheelSpin(address player, uint[] potentialPrizes, uint wonPrizeIndex);

  function spinWheel() public payable {
    uint[] memory prizes = new uint[](10);
    for (uint i = 0; i < prizes.length; i++) {
      // TODO: this should be multiplied by 2.
      uint possiblePrize = (msg.value / prizes.length * (i + 1)); // * 2;
      uint sub = msg.value / 1000;
      if (possiblePrize > sub) {
        // Subtract some value from prizes to gain profit.
        possiblePrize -= sub;
      }
      prizes[i] = possiblePrize;
    }
    uint index = random(prizes) % prizes.length;
    uint prize = prizes[index];
    payable(msg.sender).transfer(prize);
    emit WheelSpin(msg.sender, prizes, index);
  }

  function getProfit() public view returns (uint) {
    return address(this).balance;
  }

  /// Pseudo-random number generator, can be predicted.
  function random(uint[] memory prizes) internal view returns (uint) {
    return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, prizes)));
  }
}
