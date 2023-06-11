import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"
import { ethers } from "ethers";

const RPC_URL = process.env.RPC_URL;
const provider = new ethers.JsonRpcProvider(RPC_URL);

// 利用私钥和provider创建wallet对象
const privateKey = process.env.ACCOUNT_PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey, provider)

export default async function handler(req, res) {
  const query = req.query;
  const { address } = query;

  const session = await getServerSession(req, res, authOptions)
  if (session) {
    const tx = {
      to: address,
      value: ethers.parseEther("0.001")
    }
    try {
      const receipt = await wallet.sendTransaction(tx)
      await receipt.wait() // 等待链上确认交易
      res.status(200).json(receipt)
    } catch (err) {
      res.status(201).json(err)
    }
    
    // console.log(receipt) // 打印交易详情
  } else {
    res.status(401).json({message: "Unauthorized" })
  }
}