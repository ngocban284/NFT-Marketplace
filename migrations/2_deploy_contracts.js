const NFTCollection = artifacts.require("NFTCollection");
const NFTMarketplace = artifacts.require("NFTMarketplace");


module.exports = async function(deployer){
    await deployer.deploy(NFTCollection);
    const deployedNFT = await NFTCollection.deployed();

    const NFTaddress = deployedNFT.address;
    await deployer.deploy(NFTMarketplace,NFTaddress);
}