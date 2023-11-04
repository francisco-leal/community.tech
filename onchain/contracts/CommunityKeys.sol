//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract CommunityKeys {
  // communityKeys (community_name string, buyer address, amount uint256)  
  mapping(string => mapping(address => uint256)) public communityKeys;

  // fees  (owner address, community_name string)
  mapping(address => string) public owners;

  // communityKeysSupply (community_name string, supply uint256)  
  mapping(string => uint256) public communityKeysSupply;

  // fees  (community_name string, fee uint256)
  mapping(string => uint256) public fees;

  // safes  (community_address address, safe address)
  mapping(string => address) public safes;

  event CommunityCreated(address indexed _safe, address indexed _owner, uint256 _fee, string _name);

  /**
    * Event emitted when a community key is bought.
    * _community_name the community name from where the keys are bought
    * _buyer is the buyer of the keys
    * _amount_of_keys is the amount of keys bought
    * _ethSpent is the full amount of eth spent
    * _ownerFee is the fee paid to the owner
    */
  event CommunityKeyBought(
    string  _community_name,
    address indexed _buyer,
    uint256 _amount_of_keys,
    uint256 _ethSpent,
    uint256 _ownerFee
  );

  /**
    * Event emitted when a community key is sold.
    * _community_name the community name from where the keys are sold
    * _buyer is the buyer of the keys
    * _amount_of_keys is the amount of keys sold
    * _ethSpent is the full amount of eth return
    * _ownerFee is the fee paid to the owner
    */
  event CommunityKeySold(
    string  _community_name,
    address indexed _buyer,
    uint256 _amount_of_keys,
    uint256 _ethSpent,
    uint256 _ownerFee
  );


  /**
    * Contract initialization.
    */
  constructor() {}

  function createCommunity(address safe, uint256 fee, string memory name) public {
    require(safes[name] == address(0), "Community already exists");
    safes[name] = safe;
    fees[name] = fee;
    owners[msg.sender] = name;

    communityKeys[name][msg.sender]++;
    communityKeysSupply[name]++;
    emit CommunityCreated(safe, msg.sender, fee, name);
    emit CommunityKeyBought(name, msg.sender, 1, 0, 0);
  }

  function getPrice(uint256 supply, uint256 amount) public pure returns (uint256) {
    uint256 sum1 = supply == 0 ? 0 : (supply - 1 )* (supply) * (2 * (supply - 1) + 1) / 6;
    uint256 sum2 = supply == 0 && amount == 1 
    ? 
    0 : 
    (supply + amount - 1) * (supply + amount) * (2 * (supply + amount - 1) + 1) / 6;
    uint256 summation = sum2 - sum1;
    return summation * 1 ether / 16000;
  }

  function getBuyPrice(string memory communityName, uint256 amount) public view returns (uint256) {
    return getPrice(communityKeysSupply[communityName], amount);
  }

  function getSellPrice(string memory communityName, uint256 amount) public view returns (uint256) {
    return getPrice(communityKeysSupply[communityName] - amount, amount);
  }

  function getBuyPriceAfterFee(string memory communityName, uint256 amount) public view returns (uint256) {
    uint256 price = getBuyPrice(communityName, amount);
    uint256 fee = fees[communityName];

    uint256 subjectFee = (price * fee) / 1 ether;
    return price + subjectFee;
  }

  function getSellPriceAfterFee(string memory communityName, uint256 amount) public view returns (uint256) {
    uint256 price = getSellPrice(communityName, amount);
    uint256 fee = fees[communityName];

    uint256 subjectFee = price * fee / 1 ether;
    return price - subjectFee;
  }

  function buyKey(string memory communityName) public payable {
    uint256 supply = communityKeysSupply[communityName];
    require(supply != 0, "Community does not exist yet");

    uint256 price = getPrice(supply, 1);
    uint256 fee = fees[communityName];
    uint256 subjectFee = price * fee / 1 ether;
    require(msg.value >= price + subjectFee, "Insufficient payment");
    
    communityKeys[communityName][msg.sender] += 1;
    communityKeysSupply[communityName] = supply + 1;
    emit CommunityKeyBought(
      communityName,
      msg.sender,
      1,
      price + subjectFee,
      subjectFee
    );

    address safe = safes[communityName];

    (bool success1, ) = safe.call{value: subjectFee}("");

    require(success1, "Funds transfer failed");
  }

  function sellKeys(string memory communityName, uint256 amount) public payable {
    uint256 supply = communityKeysSupply[communityName];

    require(supply > amount, "Cannot sell last key");
    require(communityKeys[communityName][msg.sender] >= amount, "Insufficient keys");

    uint256 price = getPrice(supply - amount, amount);
    uint256 fee = fees[communityName];
    uint256 subjectFee = price * fee / 1 ether;

    communityKeys[communityName][msg.sender] -= amount;
    communityKeysSupply[communityName] = supply - amount;
    emit CommunityKeySold(
      communityName,
      msg.sender,
      amount,
      price - subjectFee,
      subjectFee
    );

    address safe = safes[communityName];

    // transfer to the buyer
    (bool success1, ) = msg.sender.call{value: price - subjectFee}("");

    // transfer to the owner
    (bool success2, ) = safe.call{value: subjectFee}("");

    require(success1 && success2, "Funds transfer failed");
  }
}
