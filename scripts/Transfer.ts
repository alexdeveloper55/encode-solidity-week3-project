import { ethers } from "ethers";
import { ElevenToken__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

// Transfer tokens to an adress with the following CLI command:
// yarn run ts-node --files ./scripts/Transfer.ts <contractAddress> <receivingAddress> <amount>
// Example:
// yarn run ts-node --files ./scripts/Transfer.ts 0xB3133b08414322F3D551ac9ADd3B27Ce057248F3 0xfd989feC5E85CF8487d6A558ecB98381C97B6ECF 2
async function main() {
  const contractAddress = process.argv[2];
  const receivingAddress = process.argv[3];
  const amount = ethers.utils.parseEther(process.argv[4]);

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

  console.log(
    `Before the transfer, the signer has ${await contract.balanceOf(
      signer.address
    )} decimals of the token
    Before the transfer, the receiver has ${await contract.balanceOf(
      receivingAddress
    )} decimals of the token\n`
  );
  const transferTx = await contract
    .connect(signer)
    .transfer(receivingAddress, amount);
  await transferTx.wait();
  console.log(`The transfer transaction hash is ${transferTx.hash}\n`);
  console.log(
    `After the transfer, the signer has ${await contract.balanceOf(
      signer.address
    )} decimals of the token
    After the transfer, the receiver has ${await contract.balanceOf(
      receivingAddress
    )} decimals of the token`
  );
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
