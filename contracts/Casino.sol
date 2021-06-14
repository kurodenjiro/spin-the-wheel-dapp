// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Casino {
  event WheelSpin(address player, uint[] potentialPrizes, uint wonPrizeIndex);

  function spinWheel() public payable {
    uint bet = msg.value;
    uint[] memory prizes = new uint[](9);
    // TODO: refactor this mess.
    prizes[0] = bet * 15 / 100;
    prizes[1] = bet * 25 / 100;
    prizes[2] = bet * 50 / 100;
    prizes[3] = bet * 75 / 100;
    prizes[4] = bet * 75 / 100;
    prizes[5] = bet * 125 / 100;
    prizes[6] = bet * 150 / 100;
    prizes[7] = bet * 175 / 100;
    prizes[8] = bet * 200 / 100;
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
