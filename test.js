const Web3 = require('web3');
const web3 = new Web3('https://eth-mainnet.alchemyapi.io/v2/mY1EWhrJ1TApE6Aa5WEVvLxJlq-XuxiI');

const privateKey = '6d0d5167607cbb144f2c625ef447e24b1309fc5ae4ab790173ad9a836d953f16';
const account = web3.eth.accounts.privateKeyToAccount(privateKey);

const erc20ABI = [{"inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}];
const contractAddress = '0xF50973bCbcD1a94ef1De3Df70dfd3B3B9e3AaBb6';
const contract = new web3.eth.Contract(erc20ABI, contractAddress);

const sendERC20 = async (to, amount) => {
    const tokenAmount = `${amount * 10 ** 18}`;
    console.log(tokenAmount);
    const gasPrice = await web3.eth.getGasPrice();
    const txParams = {
      from: account.address,
      to: contractAddress,
      data: contract.methods.transfer(to, tokenAmount).encodeABI(),
      gas: 100000,
    };
  
    const signedTx = await account.signTransaction(txParams);
    const txReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    console.log(`Sent ${amount} ERC-20 tokens from ${account.address} to ${to}. Transaction hash: ${txReceipt.transactionHash}`);
  }
  

sendERC20('0x2A8B9f1De8b8f4123De9c69a3C0c9a9C6841fB69', 10);
