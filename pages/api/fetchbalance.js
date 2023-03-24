// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import * as jose from 'jose'
import { Network, Alchemy,Wallet, Utils } from 'alchemy-sdk';
export default async function handler(req, res) {
// test();
const settings = {
        apiKey: process.env.API_KEY,
        network: Network.ETH_GOERLI,
    };
    
    const alchemy = new Alchemy(settings);

  async function decodeJWT(jwt){
    const secret = new TextEncoder().encode(
      process.env.SECRET_TOKEN,
    )
    const { payload } = await jose.jwtVerify(jwt, secret);
    return payload.address;
  }
    var addr;
  try{
    var addr = await decodeJWT(req.body.jwt);
  }
  catch{

  }

    if(!addr){
      res.status(200).json({ data: 'wallet not connected' })
    }
    else{
    if (req.method === 'POST') {
    const tokenAddress = ["0xF50973bCbcD1a94ef1De3Df70dfd3B3B9e3AaBb6"]
    var bal = await alchemy.core.getTokenBalances(addr,tokenAddress);
    bal=bal.tokenBalances[0].tokenBalance
    let string = eval(bal) / 10 ** 18
    bal = string.toFixed(20)*1000000000000000000;
    // Get all the NFTs owned by an address
    
    // Listen to all new pending transactions
      res.status(200).json({ data: bal })
    } else {
      res.status(200).json({ data: 'sorry' })
    }
  }
  
}
