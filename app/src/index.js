import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import SolnSquareVerifierArtifact from '../../build/contracts/SolnSquareVerifier.json'
const SolnSquareVerifier = contract(SolnSquareVerifierArtifact)
let proof = require('../../../zokrates/code/square/proof');
let proof1 = require('../proofs/proof1');
let proof2 = require('../proofs/proof2');
let proof3 = require('../proofs/proof3');
let proof4 = require('../proofs/proof4');
let proof5 = require('../proofs/proof5');
let proof6 = require('../proofs/proof6');
let proof7 = require('../proofs/proof7');
let proof8 = require('../proofs/proof8');
let proof9 = require('../proofs/proof9');
let proof10 = require('../proofs/proof10');

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
let accounts
let account
let instance;
let proofInput = 2;
// let proof = require('../../eth-contracts/test/proof.json');

const start = async () => {
  // Bootstrap the MetaCoin abstraction for Use.
  SolnSquareVerifier.setProvider(web3.currentProvider)

  const accs = await web3.eth.getAccounts();
  accounts = accs;
  account = accounts[0];
  console.log(accounts);

  console.log('web3.currentProvider...')
  console.log(web3.currentProvider);

  instance = await SolnSquareVerifier.deployed();
  console.log(instance);
  let owner = await instance.getOwner.call();
  console.log('Contract owner: ' + JSON.stringify(owner));
  console.log(instance);
}
const mintToken = async () => {
  const id = document.getElementById("propertyid").value;
  const { proof: { a, b, c }, inputs: inputs } = proof10;

  await instance.mintToken(account, id, a, b, c, inputs, { from: account, gas: 4500000 });
  proofInput++;
  App.setMessage(`New Property #${id} Owner is: ${account}`);
}

const tokenURI = async () => {
  const id = document.getElementById("propertyid").value;
  
  let uri = await instance.tokenURI.call(id, { from: account, gas: 4500000 });
  App.setMessage("tokenURI: " + uri + ".");
}

const isSolutionExist = async (input) => {
  const { proof: { a, b, c }, inputs: inputs } = proof;
  let key = await instance.getVerifierKey.call(a,b,c,[input*input, input], { from: account, gas: 4500000 });
  let owner = await instance.uniqueSolutions.call(key, { from: account, gas: 4500000 });
  App.setMessage("solution owner: " + owner + ".");
}


const App = {
  start: function () {
    start();
  },

  setMessage: function(mess) {
    const message = document.getElementById('message')
    message.innerHTML = mess;
  },

  mint: function () {
    mintToken();
  },

  geturi: function () {
    tokenURI();
  },
  proofInput: proofInput,
  isSolutionExist: function(input){
    isSolutionExist(input);
  }
}

window.App = App

window.addEventListener('load', function () {

  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn(
      'Using web3 detected from external source.' +
      ' If you find that your accounts don\'t appear or you have 0 MetaCoin,' +
      ' ensure you\'ve configured that source properly.' +
      ' If using MetaMask, see the following link.' +
      ' Feel free to delete this warning. :)' +
      ' http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider)
  } else {
    console.warn(
      'No web3 detected. Falling back to http://127.0.0.1:9545.' +
      ' You should remove this fallback when you deploy live, as it\'s inherently insecure.' +
      ' Consider switching to Metamask for development.' +
      ' More info here: http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    //
    // window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:9545'))
    window.web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/74e043df9ed94724a4f547e17ddd50fc'))
  }

  App.start()
})