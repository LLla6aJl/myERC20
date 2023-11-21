// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IFoundation {
    function sendHelp(uint256 amount) external;
    function updateFoundationDescription(string memory _description) external;
}

contract FundManager {
error WithdrawMax(uint256 amount, uint256 maxAmount);
error WithdrawOnlyOwner(address owner);
error UpdateDescriptionOnlyOwner(address owner);
event Created(address indexed owner, address donationReceiver, string description, address contractAddress);
  IFoundation target;
 mapping (address => address) public creations;

    function createFoundation(address payable _donationReceiver,string memory _description) external payable {
          address newContractAddress = address(new Foundation{value: msg.value}(_donationReceiver, _description));
          creations[newContractAddress] = msg.sender;
           emit Created(msg.sender,_donationReceiver, _description, newContractAddress);
    }

    function transferFundsToReceiver(address payable foundationAddress, uint256 amount) external {
        if (creations[foundationAddress] != msg.sender) {
            revert WithdrawOnlyOwner(msg.sender);
        }
        target = IFoundation(foundationAddress);
        target.sendHelp(amount);
    }

    function updateFoundationDescription(address foundationAddress, string memory description) external {
        if (creations[foundationAddress] != msg.sender) {
            revert UpdateDescriptionOnlyOwner(msg.sender);
        }
        target = IFoundation(foundationAddress);
        target.updateFoundationDescription(description);

    }


}

contract Foundation is Ownable, IFoundation {
    error WithdrawMax(uint256 amount, uint256 maxAmount);
    error MinimumDonate(uint256 amount, bool required);
    address payable public donationReceiver;
    string public description;
    mapping (address => uint) public payments;
    address[] public  investors;
    uint256 totalAmount;

    constructor(address payable _donationReceiver  , string memory _description) Ownable() payable  {
        donationReceiver = _donationReceiver;
        description = _description;
        payments[msg.sender] = msg.value;
        totalAmount+=msg.value;
    }
    
    event DonationWithdrawal(address donationReceiver, uint256 amount);
    event Donate(address donation, uint256 amount);
    event Received(address, uint);

     function updateFoundationDescription(string memory _description) external onlyOwner  {
            description =_description;
     }

        function sendHelp(uint256 amount) external onlyOwner {
            if (totalAmount < amount) {
                revert WithdrawMax(amount,totalAmount);
            }
        donationReceiver.transfer(amount);
        totalAmount -=amount;
        emit DonationWithdrawal(donationReceiver,amount);
    }

       function donate() public payable  {
        if (msg.value <1) {
             revert MinimumDonate({
                amount: msg.value,
                required: msg.value>=1
            });
        }
     
       if(payments[msg.sender] == 0  ){
             investors.push(msg.sender);
        } 

       payments[msg.sender] += msg.value;
        totalAmount+=msg.value;
        emit Donate(msg.sender, msg.value);
       

    }

    function getDonators() external view returns (address[] memory) {
            address[] memory ret = investors;
            return ret;
    }

    function getSumOfDonations() external view returns(uint256) {
        return totalAmount;
    }

    receive() external payable {
        emit Received(msg.sender, msg.value);
        donate();
    }
}