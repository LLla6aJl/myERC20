import { expect } from "chai"
import { ethers } from "hardhat"
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import { Foundation__factory, FundManager } from "../../typechain"

const DONATIONRECEIVER = "0x1234567890123456789012345678901234567890"
const DESCRIPTION = "Test Foundation"
const AMOUNT = ethers.utils.parseEther("1.0")
const AMOUNT2 = ethers.utils.parseEther("2.0")
const AMOUNT3 = ethers.utils.parseEther("3.0")
const NEWDESCRIPTION = "hello world"

describe("FundManager", function () {
    let FundManager
    let fundManager: FundManager
    let Foundation: Foundation__factory

    async function deployContractFixture() {
        const [deployer, fakeUser] = await ethers.getSigners()
        FundManager = await ethers.getContractFactory("FundManager")
        fundManager = await FundManager.connect(deployer).deploy()
        Foundation = await ethers.getContractFactory("Foundation")
        await fundManager.deployed()

        const foundationItem = await fundManager.createFoundation(
            ethers.utils.getAddress(DONATIONRECEIVER),
            DESCRIPTION,
            { value: AMOUNT }
        )
        const events = await fundManager.queryFilter(
            fundManager.filters.Created(),
            foundationItem.blockNumber
        )
        expect(events.length).to.equal(1)
        const newContractAddress = events[0].args.contractAddress
        return { newContractAddress, deployer, fakeUser }
    }

    it("should create a new Foundation", async () => {
        const { newContractAddress } = await loadFixture(deployContractFixture)

        const createdFoundation = Foundation.attach(newContractAddress)

        expect(await createdFoundation.description()).to.equal(DESCRIPTION)
        expect(await createdFoundation.donationReceiver()).to.equal(DONATIONRECEIVER)
    })

    it("should transfer funds to Foundation", async () => {
        const { newContractAddress } = await loadFixture(deployContractFixture)

        await fundManager.transferFundsToReceiver(newContractAddress, AMOUNT)

        const createdFoundation = Foundation.attach(newContractAddress)

        const foundationBalance = await ethers.provider.getBalance(createdFoundation.address)
        expect(foundationBalance).to.equal(0)
    })

    it("should transfer funds with amount more then totalAmount to Foundation", async () => {
        const { newContractAddress } = await loadFixture(deployContractFixture)

        await expect(
            fundManager.transferFundsToReceiver(newContractAddress, ethers.utils.parseEther("2.0"))
        ).to.be.revertedWithCustomError(fundManager, "WithdrawMax")
    })

    it("should transfer funds by Fake", async () => {
        const { newContractAddress, fakeUser } = await loadFixture(deployContractFixture)
        await expect(
            fundManager.connect(fakeUser).transferFundsToReceiver(newContractAddress, 100)
        ).to.be.revertedWithCustomError(fundManager, "WithdrawOnlyOwner")
    })

    it("update Foundation discription", async () => {
        const { newContractAddress, fakeUser } = await loadFixture(deployContractFixture)

        await fundManager.updateFoundationDescription(newContractAddress, NEWDESCRIPTION)

        const createdFoundation = Foundation.attach(newContractAddress)

        const foundationDescription = await createdFoundation.description()
        expect(foundationDescription).to.equal(NEWDESCRIPTION)
    })

    it("should update description by Fake", async () => {
        const { newContractAddress, fakeUser } = await loadFixture(deployContractFixture)
        await expect(
            fundManager.connect(fakeUser).updateFoundationDescription(newContractAddress, "hi")
        ).to.be.revertedWithCustomError(fundManager, "UpdateDescriptionOnlyOwner")
    })

    describe("Foundation tests", function () {
        it("should send Help by FakeUser", async () => {
            const { newContractAddress, fakeUser } = await loadFixture(deployContractFixture)

            const createdFoundation = Foundation.attach(newContractAddress)

            await expect(createdFoundation.connect(fakeUser).sendHelp(AMOUNT)).to.be.revertedWith(
                "Ownable: caller is not the owner"
            )
        })

        it("should accept a donation above the minimum", async () => {
            const { newContractAddress } = await loadFixture(deployContractFixture)
            const createdFoundation = Foundation.attach(newContractAddress)
            const initialBalance = await ethers.provider.getBalance(newContractAddress)
            const donationAmount = 2

            await createdFoundation.donate({ value: donationAmount })

            const finalBalance = await ethers.provider.getBalance(createdFoundation.address)
            expect(finalBalance).to.equal(initialBalance.add(donationAmount))
        })

        it("should revert if the donation is below the minimum", async () => {
            const { newContractAddress } = await loadFixture(deployContractFixture)
            const invalidDonationAmount = 0
            const createdFoundation = Foundation.attach(newContractAddress)
            await expect(
                createdFoundation.donate({ value: invalidDonationAmount })
            ).to.be.revertedWithCustomError(createdFoundation, "MinimumDonate")
        })

        it("should add investor if it's their first donation and second donation", async () => {
            const { newContractAddress, fakeUser } = await loadFixture(deployContractFixture)
            const createdFoundation = Foundation.attach(newContractAddress)
            const initialInvestorsCount = await createdFoundation.investors.length
            expect(await createdFoundation.payments(fakeUser.address)).to.equal(0)
            await createdFoundation.connect(fakeUser).donate({ value: AMOUNT })
            const finalInvestorsCount = await createdFoundation.getDonators()
            expect(finalInvestorsCount.length).to.equal(initialInvestorsCount + 1)

            await createdFoundation.connect(fakeUser).donate({ value: AMOUNT })
            const finalPayment = await createdFoundation.payments(fakeUser.address)
            expect(finalPayment).to.equal(AMOUNT2)

            await expect(createdFoundation.connect(fakeUser).donate({ value: AMOUNT }))
                .to.emit(createdFoundation, "Donate")
                .withArgs(fakeUser.address, AMOUNT)
        })

        it("should return the list of donators", async () => {
            const { newContractAddress } = await loadFixture(deployContractFixture)
            const [donator1, donator2] = await ethers.getSigners()
            const createdFoundation = Foundation.attach(newContractAddress)

            await createdFoundation.connect(donator1).donate({ value: 5 })
            await createdFoundation.connect(donator2).donate({ value: 8 })

            const donators = await createdFoundation.getDonators()

            expect(donators).to.include(donator1.address)
            expect(donators).to.include(donator2.address)
            expect(donators.length).to.equal(2)
        })

        it("should return the sum of donations", async () => {
            const { newContractAddress } = await loadFixture(deployContractFixture)
            const [donator1, donator2] = await ethers.getSigners()
            const createdFoundation = Foundation.attach(newContractAddress)

            await createdFoundation.connect(donator1).donate({ value: AMOUNT })
            await createdFoundation.connect(donator2).donate({ value: AMOUNT })

            const sumOfDonations = await createdFoundation.getSumOfDonations()

            expect(sumOfDonations).to.equal(AMOUNT3)
        })

        it("should receive a donation and call donate()", async () => {
            const { newContractAddress } = await loadFixture(deployContractFixture)
            const createdFoundation = Foundation.attach(newContractAddress)
            const [donator1] = await ethers.getSigners()

            await donator1.sendTransaction({
                to: createdFoundation.address,
                value: AMOUNT,
            })

            const contractBalance = await ethers.provider.getBalance(newContractAddress)

            expect(contractBalance).to.equal(AMOUNT2)

            const donators = await createdFoundation.getDonators()
            expect(donators).to.include(donator1.address)
        })

        it("should emit Received event", async () => {
            const { newContractAddress } = await loadFixture(deployContractFixture)
            const createdFoundation = Foundation.attach(newContractAddress)
            const [donator1] = await ethers.getSigners()

            const tx = await donator1.sendTransaction({
                to: createdFoundation.address,
                value: AMOUNT,
            })

            await expect(tx)
                .to.emit(createdFoundation, "Received")
                .withArgs(donator1.address, AMOUNT)
        })
    })
})
