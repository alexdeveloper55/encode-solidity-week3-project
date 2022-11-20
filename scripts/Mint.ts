import { BigNumber, ethers } from "ethers";
import * as dotenv from "dotenv";
import { ElevenToken__factory } from "../typechain-types";
dotenv.config();

// Mint tokens for an address with the following CLI command:
// yarn run ts-node --files ./scripts/Mint.ts <contractAddress> <minteeAddress> <mintAmount>
// Example:
// yarn run ts-node --files ./scripts/Mint.ts 0xB3133b08414322F3D551ac9ADd3B27Ce057248F3 0xfd989feC5E85CF8487d6A558ecB98381C97B6ECF 1
async function main() {
  const contractAddress = process.argv[2];
  const minteeAddress = process.argv[3];
  const mintAmount = ethers.utils.parseEther(process.argv[4]);

  const provider = ethers.getDefaultProvider("goerli", {
    alchemy: process.env.ALCHEMY_API_KEY,
    etherscan: process.env.ETHERSCAN_API_KEY,
    infura: process.env.INFURA_API_KEY,
  });
  const wallet = new ethers.Wallet(process.env.KEY ?? "");
  const signer = wallet.connect(provider);
  console.log(`Connected to the wallet of ${signer.address}`);
  console.log(`The signer has a balance of ${await signer.getBalance()} wei.`);

  console.log(`Attaching to contract: ${contractAddress}\n`);
  const contractFactory = new ElevenToken__factory(signer);
  const contract = contractFactory.attach(contractAddress);

  console.log(
    `Connected to contract at address ${contract.address},
    with a token name of ${await contract.name()},
    and a token symbol of ${await contract.symbol()},
    and a total supply of ${(await contract.totalSupply()).toString()} decimals
    `
  );

  let minteeTokenBalance = await contract.balanceOf(minteeAddress);
  console.log(
    `The mintee ${minteeAddress} starts with ${minteeTokenBalance} balance`
  );
  console.log(`Minting...`);
  const mintTx = await contract.mint(minteeAddress, mintAmount);
  await mintTx.wait();
  console.log(`The mint transaction hash is ${mintTx.hash}`);
  minteeTokenBalance = await contract.balanceOf(minteeAddress);
  console.log(`The mintee now has ${minteeTokenBalance} balance`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
