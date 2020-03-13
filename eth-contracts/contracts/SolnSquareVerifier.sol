pragma solidity >=0.4.21 <0.6.0;

import "./Verifier.sol";
import './ERC721Mintable.sol';
// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
contract TestContract is Verifier {

}


// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class

contract SolnSquareVerifier is RealEstateToken{
    TestContract public verifier;

constructor(address verifierAddress) RealEstateToken() public{
    verifier = TestContract(verifierAddress);
}
// TODO define a solutions struct that can hold an index & an address
struct Result{
    uint256 index;
    address zipcode;
}
// TODO define an array of the above struct
Result[] results;

// TODO define a mapping to store unique solutions submitted
mapping (bytes32 => address) public unique;


// TODO Create an event to emit when a solution is added
event SolutionAdded(uint256 index, address zipcode);


// TODO Create a function to add the solutions to the array and emit the event
function addSolution(uint256 index, address zipcode, bytes32 key) public {
    Result memory temp = Result({index:index, zipcode:zipcode});
    results.push(temp);
    unique[key] = zipcode;
    emit SolutionAdded(index, zipcode);
}
function getVerifierKey (uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory input) pure public returns(bytes32) 
{
    return keccak256(abi.encodePacked(a, b, c, input));
}

// TODO Create a function to mint new NFT only after the solution has been verified
//  - make sure the solution is unique (has not been used before)
//  - make sure you handle metadata as well as tokenSuplly
function mintToken(address to, uint256 tokenId, uint[2] memory a,
            uint[2][2] memory b, uint[2] memory c, uint[2] memory input)
            public
{
    bytes32 key = keccak256(abi.encodePacked(a, b, c, input));
    require(unique[key] == address(0), "Solution must be unique.");
    require(verifier.verifyTx(a,b,c,input), "Solution isn't right.");
    addSolution(tokenId, to, key);
    super.mint(to, tokenId);
}
}