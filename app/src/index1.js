import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'
import SolnSquareVerifierArtifact from '../../build/contracts/SolnSquareVerifier.json'
const SolnSquareVerifier = contract(SolnSquareVerifierArtifact)
let proof = require('../../../zokrates/code/square/proof');
let proofNumber = 1;

const start = async () => {
  // Bootstrap the MetaCoin abstraction for Use.
  SolnSquareVerifier.setProvider(web3.currentProvider)

  const accs = await web3.eth.getAccounts();
  accounts = accs
  account = accounts[0]
  console.log(accounts); 

  console.log('web3.currentProvider...')
  console.log(web3.currentProvider);

  instance = await SolnSquareVerifier.deployed();
  let owner = await instance.owner.call();
  console.log('Contract owner: ' + JSON.stringify(owner));
  console.log(instance);

//   SolnSquareVerifier.setProvider(web3.currentProvider)

// const accs = await web3.eth.getAccounts();
// accounts = accs
// account = accounts[0]
// console.log(accounts);

// console.log('web3.currentProvider...')
// console.log(web3.currentProvider);


//   try {
//     // get contract instance
//     const networkId = await web3.eth.net.getId();
//     const deployedNetwork = starNotaryArtifact.networks[networkId];
//     this.meta = new web3.eth.Contract(
//       starNotaryArtifact.abi,
//       deployedNetwork.address,
//     );

//     // get accounts
//     const accounts = await web3.eth.getAccounts();
//     this.account = accounts[0];
//   } catch (error) {
//     console.error("Could not connect to contract or chain.");
//   }
}
const mint = async () => {
  const id = document.getElementById("propertyid").value;
  const { proof: { a, b, c }} = proof;

  await instance.mintToken(account, id, a, b, c, [proofNumber * proofNumber, proofNumber], { from: account, gas: 4500000 });
  proofNumber = proofNumber + 1;
  App.setStatus(`New Property #${id} Owner is: ${account}`);
}

const tokenURI = async () => {
  const id = document.getElementById("propertyid").value;
  
  let uri = await instance.tokenURI.call(id, { from: account, gas: 4500000 });
  App.setStatus("tokenURI: " + uri + ".");
}

const App = {
  web3: null,
  account: null,
  meta: null,

  start: function(){
    start();
  },

  setMessage: function(mess) {
    const message = document.getElementById('message')
    message.innerHTML = mess;
  },

  mint: function() {
    mint();
  },

  geturi: async function() {
    tokenURI();
  },

};

window.App = App;

window.addEventListener("load", async function() {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    web3.setProvider(window.ethereum)
    await window.ethereum.enable(); // get permission to access accounts
  } else {
    console.log("No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live",);
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"),);
  }

  App.start();
});