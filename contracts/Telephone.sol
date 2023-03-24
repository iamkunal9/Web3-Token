// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
//pardon with the filenames deployed from remix
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract GLDToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("Gold", "GLD") {
        _mint(msg.sender, initialSupply);
    }
}