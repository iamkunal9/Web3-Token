// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import * as jose from 'jose'
import prisma from '../../lib/prisma';
import { Network, Alchemy,Wallet, Utils } from 'alchemy-sdk';
export default async function handler(req, res) {
async function getData(wadr){
  try{
  const result = await prisma.orders.findMany({
    where: {
      wallet_address: String(wadr),
    },
  })
  return result;
}
catch{
  return {error:404};    
}

}
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
      res.status(200).json({ data: 'please connect your metamask wallet' })
    }
    else{
    if (req.method === 'POST') {
      var query = await getData(addr);

      res.status(200).json({ query })
    
    } else {
      
      res.status(200).json({ data: 'sorry' })
    }
  }
  
}
