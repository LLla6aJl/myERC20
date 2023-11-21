import { expect } from "chai";
import { ethers } from "hardhat";
import {loadFixture} from "@nomicfoundation/hardhat-network-helpers";
import { Foundation__factory, FundManager } from "../../typechain";

const donationReceiver = '0x1234567890123456789012345678901234567890';
const description = 'Test Foundation';
const amount = ethers.utils.parseEther('1.0');
const amount2 = ethers.utils.parseEther('2.0');
const amount3 = ethers.utils.parseEther('3.0');
const newDescription = "hello world";



describe('FundManager', function () {
  let FundManager;
  let fundManager: FundManager;
  let Foundation: Foundation__factory;
  
  async function deployContractFixture() {
    const [deployer, fakeUser] = await ethers.getSigners();
    FundManager = await ethers.getContractFactory("FundManager");
    fundManager = await FundManager.connect(deployer).deploy();
    Foundation = await ethers.getContractFactory("Foundation");
    await fundManager.deployed();
        // Создание Foundation
        const foundationItem = await fundManager.createFoundation(ethers.utils.getAddress(donationReceiver), description, { value: amount });
        const events = await fundManager.queryFilter(fundManager.filters.Created(), foundationItem.blockNumber);
        expect(events.length).to.equal(1);
        const newContractAddress = events[0].args.contractAddress;
        return {newContractAddress,deployer, fakeUser}
  }

  it('should create a new Foundation', async () => {
    const {newContractAddress} = await loadFixture(deployContractFixture)
    // Получение экземпляра созданной Foundation
    const createdFoundation = Foundation.attach(newContractAddress);
    // Проверка, что параметры Foundation установлены правильно
    expect(await createdFoundation.description()).to.equal(description);
    expect(await createdFoundation.donationReceiver()).to.equal(donationReceiver);
  });

  it('should transfer funds to Foundation', async () => {
    const {newContractAddress} = await loadFixture(deployContractFixture)
    // Передача средств из  Foundation
    await fundManager.transferFundsToReceiver(newContractAddress, amount);
    // Получение экземпляра созданной Foundation
    const createdFoundation = Foundation.attach(newContractAddress);
    // Проверка, что средства были переданы
    const foundationBalance = await ethers.provider.getBalance(createdFoundation.address);
    expect(foundationBalance).to.equal(0);
  });

  it('should transfer funds with amount more then totalAmount to Foundation', async () => {
    const {newContractAddress} = await loadFixture(deployContractFixture)
    // Передача средств из  Foundation
    await  expect(fundManager.transferFundsToReceiver(newContractAddress, ethers.utils.parseEther('2.0'))).to.be.revertedWithCustomError(fundManager,"WithdrawMax");
  });

  it('should transfer funds by Fake', async () => {
    const {newContractAddress, fakeUser} = await loadFixture(deployContractFixture)
    await  expect(fundManager.connect(fakeUser).transferFundsToReceiver(newContractAddress, 100)).to.be.revertedWithCustomError(fundManager,"WithdrawOnlyOwner");
  });

  it('update Foundation discription', async () => {
    const {newContractAddress, fakeUser} = await loadFixture(deployContractFixture)
   // Передача средств из  Foundation
   await fundManager.updateFoundationDescription(newContractAddress, newDescription);
   // Получение экземпляра созданной Foundation
   const createdFoundation = Foundation.attach(newContractAddress);
   // Проверка, что описание обновлено 
   const foundationDescription = await createdFoundation.description();
   expect(foundationDescription).to.equal(newDescription);
  })

  it('should update description by Fake', async () => {
    const {newContractAddress, fakeUser} = await loadFixture(deployContractFixture)
    await  expect(fundManager.connect(fakeUser).updateFoundationDescription(newContractAddress, "hi")).to.be.revertedWithCustomError(fundManager,"UpdateDescriptionOnlyOwner");
  });



  // donate
  it("should accept a donation above the minimum", async () => {
    const {newContractAddress} = await loadFixture(deployContractFixture)
    const createdFoundation = Foundation.attach(newContractAddress);
    const initialBalance = await ethers.provider.getBalance(newContractAddress);
    const donationAmount = 2;

    await createdFoundation.donate({ value: donationAmount });

    const finalBalance = await ethers.provider.getBalance(createdFoundation.address);
    expect(finalBalance).to.equal(initialBalance.add(donationAmount));
});

it("should revert if the donation is below the minimum", async () => {
  const {newContractAddress} = await loadFixture(deployContractFixture)
    const invalidDonationAmount = 0;
    const createdFoundation = Foundation.attach(newContractAddress);
    await expect(
      createdFoundation.donate({ value: invalidDonationAmount })
    ).to.be.revertedWithCustomError(createdFoundation,"MinimumDonate");
});

it("should add investor if it's their first donation and second donation", async () => {
  const {newContractAddress, fakeUser} = await loadFixture(deployContractFixture)
  const createdFoundation = Foundation.attach(newContractAddress);
  const initialInvestorsCount = await createdFoundation.investors.length;
    expect(await createdFoundation.payments(fakeUser.address)).to.equal(0);
    await createdFoundation.connect(fakeUser).donate({ value: amount });
    const finalInvestorsCount = await createdFoundation.getDonators();
    expect(finalInvestorsCount.length).to.equal(initialInvestorsCount + 1);


    await createdFoundation.connect(fakeUser).donate({ value: amount });
    const finalPayment = await createdFoundation.payments(fakeUser.address);
    expect(finalPayment).to.equal(amount2);

    await expect(
      createdFoundation.connect(fakeUser).donate({ value: amount })
  ).to.emit(createdFoundation, "Donate")
   .withArgs(fakeUser.address, amount);
});

it("should return the list of donators", async () => {
  const {newContractAddress} = await loadFixture(deployContractFixture)
  const [donator1, donator2] = await ethers.getSigners();
  const createdFoundation = Foundation.attach(newContractAddress);


  await createdFoundation.connect(donator1).donate({ value: 5 });
  await createdFoundation.connect(donator2).donate({ value: 8 });

  const donators = await createdFoundation.getDonators();

  // Проверяем, что возвращенный массив содержит адреса донаторов
  expect(donators).to.include(donator1.address);
  expect(donators).to.include(donator2.address);
  expect(donators.length).to.equal(2);
});

it("should return the sum of donations", async () => {
  const {newContractAddress} = await loadFixture(deployContractFixture)
  const [donator1, donator2] = await ethers.getSigners();
  const createdFoundation = Foundation.attach(newContractAddress);

  await createdFoundation.connect(donator1).donate({ value: amount });
  await createdFoundation.connect(donator2).donate({ value: amount });

  const sumOfDonations = await createdFoundation.getSumOfDonations();

  // Проверяем, что возвращенная сумма равна сумме взносов
  expect(sumOfDonations).to.equal(amount3);
});

it("should receive a donation and call donate()", async () => {
  const {newContractAddress} = await loadFixture(deployContractFixture)
  const createdFoundation = Foundation.attach(newContractAddress);
  const [donator1] = await ethers.getSigners();


  // Передаем эфирные средства через функцию receive()
    await donator1.sendTransaction({
    to: createdFoundation.address,
    value: amount, 
   
});

  // Получаем текущий баланс контракта
  const contractBalance = await ethers.provider.getBalance(newContractAddress);

  // Проверяем, что баланс контракта увеличился на сумму взноса
  expect(contractBalance).to.equal(amount2);

  // Проверяем, что функция donate() была вызвана
  const donators = await createdFoundation.getDonators();
  expect(donators).to.include(donator1.address);
});

it("should emit Received event", async () => {
  const {newContractAddress} = await loadFixture(deployContractFixture)
  const createdFoundation = Foundation.attach(newContractAddress);
  const [donator1] = await ethers.getSigners();

  // Передаем эфирные средства через функцию receive()
  const tx = await donator1.sendTransaction({
    to: createdFoundation.address,
    value: amount, 
});


  // Проверяем, что событие Received было успешно вызвано
  await expect(tx).to.emit(createdFoundation, "Received")
      .withArgs(donator1.address, amount);
});

})

