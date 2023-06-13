import Head from "next/head";
import { useEffect, useState } from 'react';
import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  const [address, setAddress] = useState("")

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoding] = useState("")

  function faucet() {
    async function f() {
      {
        setIsLoding(true)
        const response = await fetch("/api/faucet?address=" + address);
        let rs = await response.json()
        if (response.status != 200) {
          if (rs.message) {
            setError(rs.message)
          } else {
            setError("Unknown error")
          }
        } else {
          setSuccess("success：" + rs.hash)
        }
        setIsLoding(false)
     }
   }
   if (!address) {
    setError("Please enter your address first")
   } else if (session) {
     f()
   } else {
    setError("Please login first")
   }
  }

  return (
    <div>
      <Head>
        <title>Sepolia | Faucet by Benjam</title>
      </Head>
      <div className="min-h-screen flex flex-col bg-white">
        <div className="flex justify-end p-4">
        {!session ? (
          <>
            <button className="btn btn-neutral" onClick={() => signIn()}>Sign in</button>
          </>
        ) : (
          <span className="text-gray-400 text-sm">Welcome! {session.user.name}</span>
        )}
        </div>
        <div className="flex flex-col items-center justify-center flex-grow">
          <div className="max-w-2xl w-full px-4 py-8 sm:px-6 sm:py-12 bg-gray-800 rounded-lg shadow-lg text-white">
            <h1 className="text-4xl font-bold mb-6 text-center">Goerli Faucet</h1>
            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
            {success && <p className="text-green-500 mb-4 text-center">{success}</p>}
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <div className="w-full">
                  <label htmlFor="address" className="sr-only">Address</label>
                  <input type="text" id="address" name="address" placeholder="Address"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                    required onChange={(e) => {setAddress(e.target.value)}} />
                </div>
              </div>
              <button type="submit"
                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg font-semibold text-white" disabled={isLoading} onClick={() => {faucet()}}>{isLoading ? 'Requesting...' : 'Request Faucets'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}