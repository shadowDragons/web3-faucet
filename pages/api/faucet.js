import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"
import { ethers } from "ethers";
import { PrismaClient } from '@prisma/client';

const RPC_URL = process.env.RPC_URL;
const provider = new ethers.JsonRpcProvider(RPC_URL);

// 利用私钥和provider创建wallet对象
const privateKey = process.env.ACCOUNT_PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey, provider)

const prisma = new PrismaClient();

async function checkCanFaucet(email)
{
  const faucetData = await prisma.faucet.findUnique({
    where: {
      email: email,
    }
  });
  console.log(faucetData)

  if (!faucetData) {
    await prisma.faucet.create({
      data: {
        email: email,
        faucetTime: new Date()
      },
    })
    return true;
  } else {
    const lastFaucetTime = new Date(faucetData.faucetTime);
    const now = new Date();
    const timeDiff = now.getTime() - lastFaucetTime.getTime();
    const oneDayInMilliseconds = 24 * 60 * 60 * 1000; // 一天的毫秒数
    if (timeDiff > oneDayInMilliseconds) {
      await prisma.faucet.update({
        where: {
          email: email
        },
        data: {
          faucetTime: new Date()
        },
      });
      return true;
    }
  }
  return false;
}

export default async function handler(req, res) {
  const query = req.query;
  const { address } = query;

  const session = await getServerSession(req, res, authOptions)
  if (session) {
    const hasFaucet = await checkCanFaucet(session.user.email);
    if (!hasFaucet) {
      res.status(202).json({message: "Sorry! To be fair to all developers, we only send 0.001 Sepolia ETH every 24 hours. Please try again after 24 hours from your original request."});
      return ;
    }
    const tx = {
      to: address,
      value: ethers.parseEther("0.001")
    }
    try {
      const receipt = await wallet.sendTransaction(tx)
      await receipt.wait() // 等待链上确认交易
      console.log(receipt)
      res.status(200).json(receipt)
    } catch (err) {
      console.log(err)
      res.status(201).json(err)
    }
  } else {
    res.status(401).json({message: "Unauthorized" })
  }
}