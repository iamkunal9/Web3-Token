// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "./Telephone.sol";
//pardon with the filenames deployed from remix

import "@openzeppelin/contracts/access/Ownable.sol";

contract Vendor is Ownable {


  GLDToken yourToken;


  uint256 public tokensPerEth = 100;

  event BuyTokens(address buyer, uint256 amountOfETH, uint256 amountOfTokens);
  event SellTokens(address seller, uint256 amountOfTokens, uint256 amountOfETH);

  constructor(address tokenAddress) {
    yourToken = GLDToken(tokenAddress);
  }

  /**
  * @notice Allow users to buy tokens for ETH
  */

  /**
  * @notice Allow users to sell tokens for ETH
  */
  function sellTokens(uint256 tokenAmountToSell) public {

    require(tokenAmountToSell > 0, "Specify an amount of token greater than zero");


    uint256 userBalance = yourToken.balanceOf(msg.sender);
    require(userBalance >= tokenAmountToSell, "Your balance is lower than the amount of tokens you want to sell");


    (bool sent) = yourToken.transferFrom(msg.sender, address(this), tokenAmountToSell);
    require(sent, "Failed to transfer tokens from user to vendor");

  }

  /**
  * @notice Allow the owner of the contract to withdraw ETH
  */
  function withdraw() public onlyOwner {
    uint256 ownerBalance = address(this).balance;
    require(ownerBalance > 0, "Owner has not balance to withdraw");

    (bool sent,) = msg.sender.call{value: address(this).balance}("");
    require(sent, "Failed to send user balance back to the owner");
  }
}