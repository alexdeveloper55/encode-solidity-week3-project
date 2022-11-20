import { ethers } from "ethers";
import * as dotenv from "dotenv";
import { ElevenToken__factory } from "../typechain-types";
dotenv.config();

// Delegate tokens for voting power with the following CLI command:
// yarn run ts-node --files ./scripts/Delegate.ts <contractAddress>
// Example:
// yarn run ts-node --files ./scripts/Delegate.ts 0xB3133b08414322F3D551ac9ADd3B27Ce057248F3
async function main() {
  const contractAddress = process.argv[2];

  const provider = ethers.getDefaultProvider("goerli", {
    alchemy: process.env.ALCHEMY_API_KEY,
    etherscan: process.env.ETHERSCAN_API_KEY,
    infura: process.env.INFURA_API_KEY,
  });
  const wallet = new ethers.Wallet(process.env.KEY ?? "");
  const voter = wallet.connect(provider);
  const contractFactory = new ElevenToken__factory(voter);
  const contract = contractFactory.attach(contractAddress);
  console.log(`Connected to the wallet of ${voter.address}`);
  console.log(`The voter has a balance of ${await voter.getBalance()} wei.`);

  let votePower = await contract.getVotes(voter.address);
  console.log(`The voter has ${votePower} decimals of vote power`);
  const delegateTx = await contract.connect(voter).delegate(voter.address);
  await delegateTx.wait();
  votePower = await contract.getVotes(voter.address);
  console.log(
    `After the self delegation, the voter has ${votePower} decimals of vote power`
  );
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
