// Test if a new solution can be added for contract - SolnSquareVerifier
var SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
var TestContract = artifacts.require('TestContract');
// Test if an ERC721 token can be minted for contract - SolnSquareVerifier
let proof = require('../../zokrates/code/square/proof');

contract('SolnSquareVerifier', accounts => {

    const origin = accounts[0];
    const two = accounts[1];
    
    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.verifier = await TestContract.new({from: origin});
            this.contract = await SolnSquareVerifier.new(this.verifier.address, {from: origin})
        })

        it('New Solution added', async function () {
            const { proof: { a, b, c }, inputs: inputs } = proof;
            let key = await this.contract.getVerifierKey.call(a, b, c, inputs);
            let added = await this.contract.addSolution(2, two, key);
            assert.equal(added.logs.length, 1, "Solution added event emited");
        })

        it('Token can be minted', async function () {
            let pass = true;
            try{
                const { proof: { a, b, c }, inputs: inputs } = proof;
                await this.contract.mintToken.call(two, 2,a, b,c, [79, 1], {from:origin});
            }catch(e){
                pass = false;
            }
            assert.equal(pass, true, "Token can not be minted");
        })

    });
})