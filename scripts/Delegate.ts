import { ethers } from "ethers";
import * as dotenv from "dotenv";
import { ElevenToken__factory } from "../typechain-types";
dotenv.config();

// Delegate tokens for voting power with the following CLI command:
// yarn run ts-node --files ./scripts/Delegate.ts <contractAddress> <delegateeAddress>
// Example:
// yarn run ts-node --files ./scripts/Delegate.ts 0xB3133b08414322F3D551ac9ADd3B27Ce057248F3 0x849bf00cd4612e3d2033bc10b64ac970d2bb427f
async function main() {
  const contractAddress = process.argv[2];
  const delegateeAddress = process.argv[3];

  const provider = ethers.getDefaultProvider("goerli", {
    alchemy: process.env.ALCHEMY_API_KEY,
    etherscan: process.env.ETHERSCAN_API_KEY,
    infura: process.env.INFURA_API_KEY,
  });
  const wallet = new ethers.Wallet(process.env.KEY ?? "");
  const signer = wallet.connect(provider);
  const contractFactory = new ElevenToken__factory(signer);
  const contract = contractFactory.attach(contractAddress);
  console.log(`Connected to the wallet of ${signer.address}`);
  console.log(`The signer has a balance of ${await signer.getBalance()} wei.`);

  console.log(`The signer is delegating their votes to ${delegateeAddress}`);
  let votePower = await contract.getVotes(delegateeAddress);
  console.log(`The delegatee has ${votePower} decimals of vote power`);
  const delegateTx = await contract.connect(signer).delegate(delegateeAddress);
  await delegateTx.wait();
  votePower = await contract.getVotes(delegateeAddress);
  console.log(
    `After the delegation, the delegatee has ${votePower} decimals of vote power`
  );
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
