import { expect } from "chai"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { ethers } from "hardhat"
import { Contract } from "ethers"

const DECIMALS = 18
const NAME = "MyToken"
const SYMBOL = "MTK"
const INITIAL_AMOUNT = ethers.utils.parseEther("10")
const ONE_TOKEN = ethers.utils.parseEther("1")
const TWO_TOKEN = ethers.utils.parseEther("2")
const THREE_TOKEN = ethers.utils.parseEther("3")
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

describe("MyToken Contract ERC20", function () {
    let MyToken
    let myToken: Contract
    let owner: SignerWithAddress,
        user1: SignerWithAddress,
        user2: SignerWithAddress,
        users: SignerWithAddress[]

    beforeEach(async () => {
        MyToken = await ethers.getContractFactory("ERC20Token")
        ;[owner, user1, user2, ...users] = await ethers.getSigners()
        myToken = await MyToken.deploy(NAME, SYMBOL, DECIMALS, INITIAL_AMOUNT)
    })

    describe("Initial params of contract", async () => {
        it("Should properly set Name", async () => {
            expect(await myToken.name()).eq(NAME)
        })

        it("Should properly set Symbol", async () => {
            expect(await myToken.symbol()).eq(SYMBOL)
        })

        it("Should properly set Decimals", async () => {
            expect(await myToken.decimals()).eq(DECIMALS)
        })

        it("Should properly set TotalSupply", async () => {
            expect(await myToken.totalSupply()).eq(INITIAL_AMOUNT)
        })

        it("Should properly set Owner", async () => {
            expect(await myToken.owner()).eq(owner.address)
        })

        it("Should properly set Owner balance", async () => {
            expect(await myToken.balanceOf(owner.address)).eq(INITIAL_AMOUNT)
        })
    })

    describe("Transfer", function () {
        it("should transfer tokens from sender to recipient", async function () {
            const initialOwnerBalance = await myToken.balanceOf(owner.address)
            const initialRecipientBalance = await myToken.balanceOf(user2.address)

            await expect(myToken.connect(owner).transfer(user2.address, ONE_TOKEN))
                .to.emit(myToken, "Transfer")
                .withArgs(owner.address, user2.address, ONE_TOKEN)

            const finalOwnerBalance = await myToken.balanceOf(owner.address)
            const finalRecipientBalance = await myToken.balanceOf(user2.address)

            expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(ONE_TOKEN))
            expect(finalRecipientBalance).to.equal(initialRecipientBalance.add(ONE_TOKEN))
        })

        it("should revert if recepient zero address", async function () {
            await expect(
                myToken.connect(owner).transfer(ZERO_ADDRESS, ONE_TOKEN)
            ).to.be.revertedWithCustomError(myToken, "ZeroAddress")
        })

        it("should revert if sender does not have enough balance", async function () {
            const initialOwnerBalance = await myToken.balanceOf(owner.address)

            await expect(
                myToken.connect(owner).transfer(user2.address, initialOwnerBalance.add(1))
            ).to.be.revertedWithCustomError(myToken, "InsufficientBalance")

            // Check that balances remain unchanged
            const finalOwnerBalance = await myToken.balanceOf(owner.address)
            expect(finalOwnerBalance).to.equal(initialOwnerBalance)
        })
    })

    describe("Allowance", function () {
        it("should return the allowance for a spender", async function () {
            const amountToApprove = 100
            await myToken.connect(owner).approve(user1.address, amountToApprove)

            const allowance = await myToken.allowance(owner.address, user1.address)
            expect(allowance).to.equal(amountToApprove)
        })

        it("should return 0 allowance if not approved", async function () {
            const allowance = await myToken.allowance(owner.address, user1.address)
            expect(allowance).to.equal(0)
        })
    })

    describe("Approve", function () {
        it("should approve allowance for a spender", async function () {
            const amountToApprove = 100
            await expect(myToken.connect(owner).approve(user1.address, amountToApprove))
                .to.emit(myToken, "Approval")
                .withArgs(owner.address, user1.address, amountToApprove)

            const allowance = await myToken.allowance(owner.address, user1.address)
            expect(allowance).to.equal(amountToApprove)
        })

        it("should update allowance for a spender", async function () {
            const initialAmountToApprove = 100
            const updatedAmountToApprove = 150

            await myToken.connect(owner).approve(user1.address, initialAmountToApprove)

            await expect(myToken.connect(owner).approve(user1.address, updatedAmountToApprove))
                .to.emit(myToken, "Approval")
                .withArgs(owner.address, user1.address, updatedAmountToApprove)

            const allowance = await myToken.allowance(owner.address, user1.address)
            expect(allowance).to.equal(updatedAmountToApprove)
        })
    })

    describe("Transfer From", function () {
        it("should revert if To = zero address", async function () {
            await expect(
                myToken.connect(owner).transferFrom(user1.address, ZERO_ADDRESS, ONE_TOKEN)
            ).to.be.revertedWithCustomError(myToken, "ZeroAddress")
        })

        it("should allow transfer from approved allowance", async function () {
            await expect(await myToken.transfer(user1.address, TWO_TOKEN)).to.emit(
                myToken,
                "Transfer"
            )

            await expect(await myToken.connect(user1).approve(user2.address, ONE_TOKEN)).to.emit(
                myToken,
                "Approval"
            )
            const initialOwnerBalance = await myToken.balanceOf(user1.address)
            const initialRecipientBalance = await myToken.balanceOf(user2.address)

            await expect(
                await myToken.connect(user2).transferFrom(user1.address, user2.address, ONE_TOKEN)
            ).to.emit(myToken, "Transfer")

            const finalOwnerBalance = await myToken.balanceOf(user1.address)
            const finalRecipientBalance = await myToken.balanceOf(user2.address)

            expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(ONE_TOKEN))
            expect(finalRecipientBalance).to.equal(initialRecipientBalance.add(ONE_TOKEN))

            const allowanceAfterTransfer = await myToken.allowance(user1.address, user2.address)
            expect(allowanceAfterTransfer).to.equal(0)
        })

        it("should revert if insufficient balance", async function () {
            await myToken.connect(user1).approve(user2.address, TWO_TOKEN)

            await expect(
                myToken.connect(user2).transferFrom(user1.address, user2.address, TWO_TOKEN)
            ).to.be.revertedWithCustomError(myToken, "InsufficientBalance")
        })

        it("should revert if insufficient allowance", async function () {
            await expect(await myToken.transfer(user1.address, THREE_TOKEN)).to.emit(
                myToken,
                "Transfer"
            )

            //  await myToken.connect(user1).approve(user2.address, TWO_TOKEN)

            await expect(
                myToken.connect(user2).transferFrom(user1.address, user2.address, ONE_TOKEN)
            ).to.be.revertedWithCustomError(myToken, "InsufficientAllowance")
        })
    })

    describe("decrease increase allowance", function () {
        it("should increase allowance for a spender", async function () {
            const initialAllowance = await myToken.allowance(user1.address, user2.address)
            await myToken.connect(user1).increaseAllowance(user2.address, ONE_TOKEN)
            const finalAllowance = await myToken.allowance(user1.address, user2.address)
            expect(finalAllowance).to.equal(initialAllowance.add(ONE_TOKEN))
        })

        it("should revert if allowance below zero", async function () {
            await expect(
                myToken.connect(user1).decreaseAllowance(user2.address, ONE_TOKEN)
            ).to.be.revertedWithCustomError(myToken, "AllowanceBelowZero")
        })

        it("should decrease allowance for a spender", async function () {
            const addedValue = 100
            await myToken.connect(user1).increaseAllowance(user2.address, addedValue)
            const initialAllowance = await myToken.allowance(user1.address, user2.address)

            await expect(await myToken.connect(user1).decreaseAllowance(user2.address, addedValue))
                .to.emit(myToken, "Approval")
                .withArgs(user1.address, user2.address, initialAllowance - addedValue)

            const finalAllowance = await myToken.allowance(user1.address, user2.address)
            expect(finalAllowance).to.equal(0)
        })
    })

    describe("Mint", function () {
        it("should allow the owner to mint tokens", async function () {
            const initialTotalSupply = await myToken.totalSupply()
            const initialOtherAccountBalance = await myToken.balanceOf(user1.address)
            const amountToMint = 100

            await expect(myToken.connect(owner).mint(user1.address, amountToMint))
                .to.emit(myToken, "Transfer")
                .withArgs(ethers.constants.AddressZero, user1.address, amountToMint)

            const finalTotalSupply = await myToken.totalSupply()
            const finalOtherAccountBalance = await myToken.balanceOf(user1.address)

            expect(finalTotalSupply).to.equal(initialTotalSupply.add(amountToMint))
            expect(finalOtherAccountBalance).to.equal(initialOtherAccountBalance.add(amountToMint))
        })

        it("should revert if a non-owner tries to mint tokens", async function () {
            const amountToMint = 100

            await expect(
                myToken.connect(user1).mint(user1.address, amountToMint)
            ).to.be.revertedWithCustomError(myToken, "OnlyOwner")
        })

        it("should revert if account zero address", async function () {
            await expect(
                myToken.connect(owner).mint(ZERO_ADDRESS, ONE_TOKEN)
            ).to.be.revertedWithCustomError(myToken, "ZeroAddress")
        })
    })

    describe("Burn", function () {
        it("should allow the owner to burn tokens", async function () {
            const initialTotalSupply = await myToken.totalSupply()
            const initialOwnerBalance = await myToken.balanceOf(owner.address)
            const amountToBurn = 100

            await expect(myToken.connect(owner).burn(owner.address, amountToBurn))
                .to.emit(myToken, "Transfer")
                .withArgs(owner.address, ethers.constants.AddressZero, amountToBurn)

            const finalTotalSupply = await myToken.totalSupply()
            const finalOwnerBalance = await myToken.balanceOf(owner.address)

            expect(finalTotalSupply).to.equal(initialTotalSupply.sub(amountToBurn))
            expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(amountToBurn))
        })

        it("should revert if a non-owner tries to burn tokens", async function () {
            const amountToBurn = 100

            await expect(
                myToken.connect(user2).burn(user2.address, amountToBurn)
            ).to.be.revertedWithCustomError(myToken, "OnlyOwner")
        })

        it("should revert if the amount to burn exceeds the balance", async function () {
            const amountToBurn = 100
            const initialBalance = await myToken.balanceOf(owner.address)

            await expect(
                myToken.connect(owner).burn(owner.address, initialBalance.add(1))
            ).to.be.revertedWithCustomError(myToken, "InsufficientBalance")
        })
    })
})
