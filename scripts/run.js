// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require('hardhat');

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const domainContractFactory = await hre.ethers.getContractFactory('Domains');
  const domainContract = await domainContractFactory.deploy('meme');
  await domainContract.deployed();
  console.log('Contract deployed to:', domainContract.address);
  console.log('Contract deployed by:', owner.address);

  let txn = await domainContract.register('doom', {
    value: hre.ethers.utils.parseEther('0.4'),
  });
  await txn.wait();

  txn = await domainContract.register('doom', {
    value: hre.ethers.utils.parseEther('0.4'),
  });
  await txn.wait();

  const domainOwner = await domainContract.getAddress('doom');
  console.log('Owner of domain:', domainOwner);

  try {
    txn = await domainContract
      .connect(randomPerson)
      .setRecord('doom', 'Haha my domain now!');
    await txn.wait();
  } catch (e) {
    console.error(e);
  }

  txn = await domainContract.setRecord('doom', 'record doom');
  await txn.wait();

  const record = await domainContract.getRecord('doom');
  console.log('Record', record);

  const address = await domainContract.getAddress('doom');
  console.log('Owner of domain doom:', address);

  const balance = await hre.ethers.provider.getBalance(domainContract.address);
  console.log('Contract balance:', hre.ethers.utils.formatEther(balance));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
