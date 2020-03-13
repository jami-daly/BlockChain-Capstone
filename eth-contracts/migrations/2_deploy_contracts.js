// migrating the appropriate contracts
var TestContract = artifacts.require("./TestContract");
var SolnSquareVerifier = artifacts.require("./SolnSquareVerifier");

module.exports = function(deployer) {
  deployer.deploy(TestContract)
    .then(() => deployer.deploy(SolnSquareVerifier, TestContract.address));
};
