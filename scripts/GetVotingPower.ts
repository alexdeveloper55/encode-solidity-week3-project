import { ethers } from "ethers";
import { ElevenToken__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

// Get the voting power of an address with the following CLI command:
// yarn run ts-node --files ./scripts/GetVotingPower.ts <contractAddress> <voterAddress>
// Example:
// yarn run ts-node --files ./scripts/GetVotingPower.ts 0xB3133b08414322F3D551ac9ADd3B27Ce057248F3 0x849bf00cd4612e3d2033bc10b64ac970d2bb427f
async function main() {
  const contractAddress = process.argv[2];
  const voterAddress = process.argv[3];

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
  console.log(
    `The signer has a balance of ${await signer.getBalance()} wei.\n`
  );

  console.log(`Fetching voting power for ${voterAddress}...\n`);

  console.log(
    `The voter has ${await contract.getVotes(
      voterAddress
    )} decimals of vote power`
  );
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
