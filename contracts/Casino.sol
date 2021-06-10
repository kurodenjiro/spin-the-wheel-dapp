// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Casino {
  function spinWheel() public payable {
    uint prize = msg.value / 2;
    payable(msg.sender).transfer(prize);
  }
}
