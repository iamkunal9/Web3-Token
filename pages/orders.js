import Head from "next/head";
import { Inter } from "@next/font/google";
import Link from "next/link";
import styles from "@/styles/Home.module.css";
import { useContext, useState } from "react";
import * as ReactDOM from 'react-dom/client';
import { AppContext } from "../context/AppContext";
import * as jose from "jose";


const inter = Inter({ subsets: ["latin"] });
export default function Orders() {

  const secret = new TextEncoder().encode(process.env.SECRET_TOKEN);
  async function generateAccessToken(waddress) {
    const alg = "HS256";
    const jwt = await new jose.SignJWT({ address: waddress })
      .setProtectedHeader({ alg })
      .setExpirationTime("2h")
      .sign(secret);
    return jwt;
  }

  
  const { account, connectWallet, error, disconnectWallet } =
    useContext(AppContext);
    function getPrice(pname,quantity){
      const data = {product_1234:`10 * ${quantity}=${10*quantity}`,product_1235:`15 * ${quantity}=${15*quantity}`,product_1236:`20 * ${quantity}=${20*quantity}`,product_1237:`5 * ${quantity}=${5*quantity}`}
      return data[pname]
    }
    function getProduct(pname){
      const data = {product_1234:"Pizza",product_1235:"Burger",product_1236:"Kambocha",product_1237:"snacks"}
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
  async function t(Acc){
  var jwt = await generateAccessToken(Acc);
    const response = await fetch("/api/fetchorders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ jwt }),
    });
    const da = await response.json();
    const data = da.query;
    
    // var totalC = data.product_1234*10 + data.product_1235*15 + data.product_1236*20 + data.product_1237*5;
    // setCost(totalC);
for(var i=0;i<data.length;i++){
  delete data[i].wallet_address;
  delete data[i].id;
for(var k in data[i]) {
      if(data[i][k]!=0)
      items.push({name:getProduct(k),price:getPrice(k,data[i][k]),id:k})
   }}

   
  try{
  var root = ReactDOM.createRoot(
    document.getElementById('root')
  );
  root.render(
  <>
    <div id="test" style={{}}>
        <h2>Past Orders</h2>
        <ul id="mylist">
          {items.map((item, index) => (
            <li key={index} style={{padding:"10px"}}>
              {item.name} - {item.price}RAT
            </li>
          ))}
        </ul>
        
      </div>
  
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
