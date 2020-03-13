var RealEstateToken = artifacts.require('RealEstateToken');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];
    const account_three = accounts[2];
    const account_four = accounts[3];
    const account_five = accounts[4];

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await RealEstateToken.new({from: account_one});
            await this.contract.mint(account_two, 1, {from: account_one});

            await this.contract.mint(account_three, 2, {from: account_one});
            await this.contract.mint(account_four, 3, {from: account_one});
            // TODO: mint multiple tokens
        })

        it('should return total supply', async function () { 
            let tot = await this.contract.totalSupply.call();
            assert.equal(tot.toNumber(), 3, "total not correct");
        })

        it('should get token balance', async function () { 
            let totBal = await this.contract.balanceOf.call(account_three, {from: account_one});
            assert.equal(totBal.toNumber(), 1, "total Balance not correct");
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            let tokUri = await this.contract.tokenURI.call(1, {from: account_one});
            assert.equal(tokUri, "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1", "total Balance not correct"); 
        })

        it('should transfer token from one owner to another', async function () { 
            let token = 2;
            await this.contract.approve(account_four, token, {from: account_three});
            await this.contract.transferFrom(account_three, account_four, token, {from: account_three});
            let currentOwner = await this.contract.ownerOf.call(token);
            assert.equal(currentOwner, account_four, "Owner isnt account_four");
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await RealEstateToken.new({from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            let pass = false;
            try{
                await this.contract.mint(account_five, 4, {from: account_three})
            }
            catch(e){
                pass = true;
            }
            assert.equal(pass, true, "Minted when address was not contract owner");
        })

        it('should return contract owner', async function () { 
            let contract_owner = await this.contract.getOwner.call({from:account_one});
            assert.equal(contract_owner,account_one,"Contract owner does not match.")
        })

    });
})