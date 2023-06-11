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
  console.log(11111)
  const query = req.query;
  const { address } = query;

  const session = await getServerSession(req, res, authOptions)
  if (session) {
    const hasFaucet = await checkCanFaucet(session.user.email);
    if (!hasFaucet) {
      console.log("24 xiaoshi")
      res.status(202).json({message: "24小时"});
      return ;
    }
    console.log("cheng le ")
    const tx = {
      to: address,
      value: ethers.parseEther("0.001")
    }
    try {
      const receipt = await wallet.sendTransaction(tx)
      await receipt.wait() // 等待链上确认交易

      res.status(200).json(receipt)
    } catch (err) {
      console.log(err)
      res.status(201).json(err)
    }
  } else {
    res.status(401).json({message: "Unauthorized" })
  }
}