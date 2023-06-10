import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from 'react';
import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  const [address, setAddress] = useState("")

  function faucet() {
    async function f() {
      {
        const response = await fetch("/api/faucet?address=" + address);
        let rs = await response.json()
        if (response.status != 200) {
          console.log(rs.code)
        } else {
          console.log(rs.hash)
        }
     }
   }
   if (session) {
     f()
   }
  }

  return (
    <div>
      {!session ? (
        <>
          <p>Not signed in</p>
          <br />
          <button onClick={() => signIn()}>Sign in</button>
        </>
      ) : (
        <main className={styles.main}>
          <div className={styles.header}>
            <h4>hello {session.user.name}</h4>
            <button onClick={() => signOut()}>Sign out</button>
          </div>
        </main>
      )}

      <input type="text" onChange={(e) => {setAddress(e.target.value)}} />
      <button onClick={() => {faucet()}}>get faucet</button>
    </div>
  );
}