// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

abstract contract MockToken is ERC20 {
  function setBalance(address receiver, uint amount) public {
    _mint(receiver, amount);
  }
}

contract MockDai is MockToken {
  constructor() ERC20("Mock Dai", "DAI") {}
}
