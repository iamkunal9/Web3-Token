// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import * as jose from 'jose'
import prisma from '../../lib/prisma';
export default async function handler(req, res) {
  async function getData(wadr){
    try{
    const result = await prisma.cart.findUnique({
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


// test();
async function insertData(data,addr){
  try{
  const result = await prisma.cart.update({
    where:{
      wallet_address:addr
    },
    data
});
return 200
}
catch{
  return 409
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
      
      var t = req.body.productId;
      if(t==undefined){
        var d = await getData(addr);
        res.status(200).json(d);

      }
      else{
        if(req.body.add){
      var query = await getData(addr);
      query = query[t]
      query = {
        [t]:query+1
      }
      insertData(query,addr);
      res.status(200).json("ok")
    }
    else{
      var query = await getData(addr);
      query = query[t]
      query = {
        [t]:query-1
      }

      insertData(query,addr);
      res.status(200).json("ok")

    }
  }
  }
    
    else {
      res.status(200).json("asds")
    }
  }
  
}
