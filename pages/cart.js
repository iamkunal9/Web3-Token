import Head from "next/head";
import { Inter } from "@next/font/google";
import Link from "next/link";
import styles from "@/styles/Home.module.css";
import { useContext, useState } from "react";
import * as ReactDOM from 'react-dom/client';
import { AppContext } from "../context/AppContext";
import * as jose from "jose";

import { tokenABI, vendorABI } from "../contracts";
import Web3 from "web3";
const web3 = new Web3(Web3.givenProvider);

const inter = Inter({ subsets: ["latin"] });
export default function Cart() {
  const [count, setCount] = useState([]);
  const [cost,setCost] = useState(0);
  // console.log(cost)
  
  
  async function order(acc){
    if(cost==0){
      alert("No Items in Cart")
    }
    else{
    // var jwt = await generateAccessToken(acc);
    sell(`${cost}`,acc);
  }

  }
  function getProduct(pname){
    const data = {product_1234:"Pizza",product_1235:"Burger",product_1236:"Kambocha",product_1237:"snacks"}
    return data[pname]
  }

  const secret = new TextEncoder().encode(process.env.SECRET_TOKEN);
  async function generateAccessToken(waddress) {
    const alg = "HS256";
    const jwt = await new jose.SignJWT({ address: waddress })
      .setProtectedHeader({ alg })
      .setExpirationTime("2h")
      .sign(secret);
    return jwt;
  }
  async function removefromcart(productId, Acc) {

    var jwt = await generateAccessToken(Acc);

    const add = false;
    const response = await fetch("/api/add-to-cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId, jwt, add}),
    });
    const data = await response.json();
    if(data=="ok"){
        t(Acc,true);
    }

  }
async function sell(tokens,Acc){
  var jwt = await generateAccessToken(Acc);
  document.getElementById("test").style.display="none";
  document.getElementById("test2").style.display="block";
    try {
      const accounts = await web3.eth.getAccounts();
      const tokenContract = new web3.eth.Contract(
        tokenABI,
        process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS
      );
      // Approve the contract to spend the tokens
      let request = await tokenContract.methods
        .approve(
          process.env.NEXT_PUBLIC_VENDOR_CONTRACT_ADDRESS,
          web3.utils.toWei(tokens, "ether")
        )
        .send({
          from: accounts[0],
        });

      // Trigger the selling of tokens
      const vendor = new web3.eth.Contract(
        vendorABI,
        process.env.NEXT_PUBLIC_VENDOR_CONTRACT_ADDRESS
      );
      request = await vendor.methods
        .sellTokens(tokens)
        .send({
          from: accounts[0],
        });
        fetch("/api/order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ jwt }),
        })
          .then((response) => response.json())
          .then((data) => data.data=="ok"?alert("Order Placed Successfully!"):alert("Db Error"))
          .catch((error) => console.error(error))
      

      // console.log(request);
    } catch (err) {
      console.error(err);
      alert("Error selling tokens");
    }
  };
  
  const { account, connectWallet, error, disconnectWallet } =
    useContext(AppContext);
    function getPrice(pname,quantity){
      const data = {product_1234:`10 * ${quantity}=${10*quantity}`,product_1235:`15 * ${quantity}=${15*quantity}`,product_1236:`20 * ${quantity}=${20*quantity}`,product_1237:`5 * ${quantity}=${5*quantity}`}
      return data[pname]
    }
    generateAccessToken(account).then((jwt)=>
    fetch("/api/fetchbalance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ jwt }),
    })
      .then((response) => response.json())
      .then((data) => ReactDOM.createRoot(
        document.getElementById('bal')
      ).render(<span>{data.data} RAT</span>))
      .catch((error) => console.error(error)));

  console.log(error);
  // const { user, logout } = useAuth() // Assume useAuth() is a custom hook that provides user info and logout function
var items = []
  async function t(Acc,ttt){
  var jwt = await generateAccessToken(Acc);
    const response = await fetch("/api/add-to-cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ jwt }),
    });
    const data = await response.json();
    delete data.wallet_address;
    var totalC = data.product_1234*10 + data.product_1235*15 + data.product_1236*20 + data.product_1237*5;
    setCost(totalC);
    
for(var k in data) {
      if(data[k]!=0)
      items.push({name:getProduct(k),price:getPrice(k,data[k]),id:k})
   }

   if(ttt)
   setCount(prevCount => [...prevCount, { asd: items.length }]);
 
   
  if(ttt)
  return 0;
  try{
  var root = ReactDOM.createRoot(
    document.getElementById('root')
  );
  root.render(
  <>
  {account?(
    <>
    <div id="test" style={{}}>
        <h2>Items in Cart:</h2>
        <ul id="mylist">
          {items.map((item, index) => (
            <li key={index} style={{padding:"10px"}}>
              {item.name} - {item.price}RAT <img onClick={()=>removefromcart(item.id,account,root)} style={{width:"15px",cursor:"pointer"}} src="https://i.postimg.cc/tg1G54zL/minus-removebg-preview.png"></img>
            </li>
          ))}
        </ul>
        <button id="btn" onClick={()=>order(account)} style={{cursor:"pointer",marginLeft:"20%"}}>Confirm Order</button>
      </div>
      <div id="test2" style={{display:"none"}}>
        <p>Transfering token wait for 1-2 Min</p>
      </div></>):(<p>Please Login First</p>)}
  
  {account ? (
          <div className="account-box">
            <p className="shadow-border">{account}</p>
          </div>
        ) : (
          console.log("wallet not connected")
        )}
        {error && <p className={`error shadow-border`}>{`Error: ${error}`}</p>}
  </>
  );
}
catch{

}
  
  
   
}
if(account){
  t(account);
}
  return (
    <>
      <Head>
        <title>Cart</title>
        <meta
          name="description"
          content="Website to reedeem your reward tokens"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <nav className={styles.nav}>
          <ul className={styles.ul}>
            <li className={styles.li}>
            <Link href="/">Home</Link>
            </li>
            <li className={styles.li}>
              <Link href="/orders">Orders</Link>
            </li>
            <li className={styles.li}>
              <Link href="/cart">Cart</Link>
            </li>
            {account ? (
              <>
                <li className={styles.li} id="bal">
                </li>
                {/* <li className={styles.li}>
                    <button onClick={disconnectWallet}>Logout</button>
                  </li> */}
              </>
            ) : (
              <li className={styles.li}>
                <a className={styles.a} onClick={connectWallet}>Login</a>
              </li>
            )}
          </ul>
        </nav>
      </div>
      <main id="root" className={styles.main}>
      <p>Please Login First</p>
        
      </main>
    </>
  );
}
