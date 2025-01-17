// this script executes when you run 'yarn test'
//
// you can also test remote submissions like:
// CONTRACT_ADDRESS=0x43Ab1FCd430C1f20270C2470f857f7a006117bbb yarn test --network rinkeby
//
// you can even run commands if the tests pass like:
// yarn test && echo "PASSED" || echo "FAILED"
//

const hre = require("hardhat");
const { ethers } = hre;
const { solidity } = require("ethereum-waffle");
const { use, expect } = require("chai");

use(solidity);

describe("Market", function () {


  let contract;

  //console.log("hre:",Object.keys(hre)) // <-- you can access the hardhat runtime env here

  let contractArtifact;
  if (process.env.CONTRACT_ADDRESS) {
  } else {
    contractArtifact = "contracts/Market.sol:Market";
  }

  it("Should deploy Market", async function () {
    const Market = await ethers.getContractFactory(contractArtifact);
    contract = await Market.deploy();
  });

  it("Should create an event", async function () {
    const [ owner ] = await ethers.getSigners();

    let events = await contract.eventsOf(owner.address);
    expect(events.length).to.equal(0);

    const result = await contract.createEvent("DevCon Bogota", "Devcon is an intensive introduction for new Ethereum explorers, a global family reunion for those already a part of our ecosystem, and a source of energy and creativity for all.", "https://devcon.org/", ethers.utils.parseEther("10"))

    console.log('\t'," ⏳  Waiting for confirmation...")
    const txResult = await result.wait()
    expect(txResult.status).to.equal(1, "Error while awaiting mint confirmation");

    events = await contract.eventsOf(owner.address);
    expect(events.length).to.equal(1);
  });
});
