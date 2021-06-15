// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Casino {
  // TODO: add token address
  event WheelSpin(address player, uint[] potentialPrizes, uint wonPrizeIndex);

  function spinWheel(address tokenAddress, uint bet) external {
    IERC20 token = IERC20(tokenAddress);
    token.transferFrom(msg.sender, address(this), bet);
    uint[] memory prizes = generatePrizes(bet);
    uint index = randomPrizeIndex(prizes);
    uint prize = prizes[index];
    // TODO: use safeTransfer
    token.transfer(msg.sender, prize);
    emit WheelSpin(msg.sender, prizes, index);
  }

  receive() external payable {
  }

  function generatePrizes(uint bet) internal pure returns (uint[] memory) {
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
    return prizes;
  }

  function randomPrizeIndex(uint[] memory prizes) internal view returns (uint) {
    return random(prizes) % prizes.length;
  }

  /// Pseudo-random number generator, can be predicted.
  function random(uint[] memory prizes) internal view returns (uint) {
    return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, prizes)));
  }
}
