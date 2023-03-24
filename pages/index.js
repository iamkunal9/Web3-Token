import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import Link from "next/link";
import styles from "@/styles/Home.module.css";
import { useContext } from "react";
import * as ReactDOM from 'react-dom';
import { AppContext } from "../context/AppContext";
import * as jose from "jose";

const inter = Inter({ subsets: ["latin"] });
export default function Home() {
  function getPrice(pname,quantity){
    const data = {product_1234:`10 * ${quantity}=${10*quantity}`,product_1235:`15 * ${quantity}=${15*quantity}`,product_1236:`20 * ${quantity}=${20*quantity}`,product_1237:`5 * ${quantity}=${5*quantity}`}
    return data[pname]
  }
  function getProduct(pname){
    const data = {product_1234:"Pizza",product_1235:"Burger",product_1236:"Kambocha",product_1237:"snacks"}
    return data[pname]
  }
  const secret = new TextEncoder().encode(process.env.SECRET_TOKEN);
  console.log(secret)
  console.log(process.env.SECRET_TOKEN)
  async function generateAccessToken(waddress) {
    const alg = "HS256";
    const jwt = await new jose.SignJWT({ address: waddress })
      .setProtectedHeader({ alg })
      .setExpirationTime("2h")
      .sign(secret);
    return jwt;
  }
  async function addtocart(productId, Acc) {
    var jwt = await generateAccessToken(Acc);

    const add = true;
    const response = await fetch("/api/add-to-cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId, jwt, add}),
    });
    const data = await response.json();
    
    if(data=="ok"){

      
      const root = ReactDOM.createRoot(
        document.getElementById('alert')
      );
      root.render(
<p>Added to cart</p>
      );
    };
    return 1;
  }
  const { account, connectWallet, error, disconnectWallet } =
    useContext(AppContext);

  console.log(error);
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
  return (
    <>
      <Head>
        <title>Reward Token</title>
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
                  <p>Fetching</p>
                </li>

              </>
            ) : (
              <li className={styles.li}>
                <a className={styles.a} onClick={connectWallet}>Login</a>
              </li>
            )}
          </ul>
        </nav>
      </div>
      
      <main className={styles.main}>
      <div id="alert"></div>
        <div className={styles.description}>
          <p>Spend your earned coins here&nbsp;</p>
        </div>

        <div className={styles.grid}>
          <a
            onClick={() => addtocart("product_1234", account)}
            className={styles.card}
          >
            <img
              className={styles.image}
              src="https://thumbs.dreamstime.com/b/pizza-rustic-italian-mozzarella-cheese-basil-leaves-35669930.jpg"
            ></img>
            <h2 className={inter.className}>
              Pizza <span>-&gt;</span>
            </h2>
            <p className={inter.className}>10RET</p>
          </a>

          <a
            onClick={() => addtocart("product_1235", account)}
            className={styles.card}
          >
            <img
              className={styles.image}
              src="https://cdn.pixabay.com/photo/2016/03/05/19/02/hamburger-1238246__480.jpg"
            ></img>
            <h2 className={inter.className}>
              Burger <span>-&gt;</span>
            </h2>
            <p className={inter.className}>50RET</p>
          </a>

          <a
            onClick={() => addtocart("product_1236", account)}
            className={styles.card}
          >
            <img
              className={styles.image}
              src="https://cdn.pixabay.com/photo/2016/03/05/19/02/hamburger-1238246__480.jpg"
            ></img>
            <h2 className={inter.className}>
              Kombucha <span>-&gt;</span>
            </h2>
            <p className={inter.className}>100 RET</p>
          </a>

          <a
            onClick={() => addtocart("product_1237", account)}
            className={styles.card}
          >
            <img
              className={styles.image}
              src="https://cdn.pixabay.com/photo/2016/03/05/19/02/hamburger-1238246__480.jpg"
            ></img>
            <h2 className={inter.className}>
              Cheeze grilled <span>-&gt;</span>
            </h2>
            <p className={inter.className}>30 RET</p>
          </a>
        </div>
        {account ? (
          <div className="account-box">
            <p className="shadow-border">{account}</p>
          </div>
        ) : (
          console.log("wallet not connected")
        )}
        {error && <p className={`error shadow-border`}>{`Error: ${error}`}</p>}
      </main>
    </>
  );
}
