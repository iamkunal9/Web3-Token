// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import * as jose from 'jose'
import prisma from '../../lib/prisma';
export default async function handler(req, res) {
// test();
async function insertData(data){
  try{
  const result = await prisma.cart.create({
    data
});
}
catch{

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
      var query = {
        wallet_address:addr,
        product_1234:0,
        product_1235:0,
        product_1236:0,
        product_1237:0
      }
      insertData(query);
      res.status(200).json({ data: 'ok' })

    } else {
      
      res.status(200).json({ data: 'sorry' })
    }
  }
  
}
