import { ethers } from "ethers";
import { ElevenToken__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  // SETTING UP AND DEPLOYING THE CONTRACT
  const provider = ethers.getDefaultProvider("goerli", {
    alchemy: process.env.ALCHEMY_API_KEY,
    etherscan: process.env.ETHERSCAN_API_KEY,
    infura: process.env.INFURA_API_KEY,
  });
  const wallet = new ethers.Wallet(process.env.KEY ?? "");
  const signer = wallet.connect(provider);
  const balance = await signer.getBalance();
  console.log(`The signer address has a balance of ${balance} wei.\n`);
  const contractFactory = new ElevenToken__factory(signer);
  const contract = await contractFactory.deploy();
  await contract.deployed();
  console.log(
    `Tokenized Votes contract deployed at ${contract.address} on the goerli network\n`
  );

  // DELEGATING VOTE POWER FROM TOKENS TO VOTER/SIGNER
  // let votePower = await contract.getVotes(signer.address);
  // console.log(
  //   `After the mint, the signer has ${votePower} decimals of vote power`
  // );
  // const delegateTx = await contract.connect(signer).delegate(signer.address);
  // await delegateTx.wait();
  // votePower = await contract.getVotes(signer.address);
  // console.log(
  //   `After the self delegation, the signer has ${votePower} decimals of vote power`
  // );
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
