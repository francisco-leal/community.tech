//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract CommunityKeys {
  // communityKeys (community_address address, buyer address, amount uint256)  
  mapping(address => mapping(address => uint256)) public communityKeys;

  mapping(address => uint256) public communityKeysSupply;

  // fees  (community_address address, fee uint256)
  mapping(address => uint256) public fees;

  // safes  (community_address address, safe address)
  mapping(address => address) public safes;

  event CommunityCreated(address indexed _safe, address indexed _owner, uint256 _fee);

  /**
    * Event emitted when a community key is bought.
    * _key is the owner of the keys
    * _buyer is the buyer of the keys
    * _amount_of_keys is the amount of keys bought
    * _ethSpent is the full amount of eth spent
    * _ownerFee is the fee paid to the owner
    */
  event CommunityKeyBought(
    address indexed _key,
    address indexed _buyer,
    uint256 _amount_of_keys,
    uint256 _ethSpent,
    uint256 _ownerFee
  );

  /**
    * Event emitted when a community key is sold.
    * _key is the owner of the keys
    * _buyer is the buyer of the keys
    * _amount_of_keys is the amount of keys sold
    * _ethSpent is the full amount of eth return
    * _ownerFee is the fee paid to the owner
    */
  event CommunityKeySold(
    address indexed _key,
    address indexed _buyer,
    uint256 _amount_of_keys,
    uint256 _ethSpent,
    uint256 _ownerFee
  );


  /**
    * Contract initialization.
    */
  constructor() {}

  // buyMembership(community_address, amount_of_keys) payable
  function getPrice(uint256 supply, uint256 amount) public pure returns (uint256) {
    uint256 sum1 = supply == 0 ? 0 : (supply - 1 )* (supply) * (2 * (supply - 1) + 1) / 6;
    uint256 sum2 = supply == 0 && amount == 1 
    ? 
    0 : 
    (supply + amount - 1) * (supply + amount) * (2 * (supply + amount - 1) + 1) / 6;
    uint256 summation = sum2 - sum1;
    return summation * 1 ether / 16000;
  }

  function getBuyPrice(address keysSubject, uint256 amount) public view returns (uint256) {
    return getPrice(communityKeysSupply[keysSubject], amount);
  }

  function getSellPrice(address keysSubject, uint256 amount) public view returns (uint256) {
    return getPrice(communityKeysSupply[keysSubject] - amount, amount);
  }

  function getBuyPriceAfterFee(address keysSubject, uint256 amount) public view returns (uint256) {
    uint256 price = getBuyPrice(keysSubject, amount);
    uint256 fee = fees[keysSubject];

    uint256 subjectFee = price * fee / 1 ether;
    return price + subjectFee;
  }

  function getSellPriceAfterFee(address keysSubject, uint256 amount) public view returns (uint256) {
    uint256 price = getSellPrice(keysSubject, amount);
    uint256 fee = fees[keysSubject];

    uint256 subjectFee = price * fee / 1 ether;
    return price - subjectFee;
  }

  function buyKey(address keysSubject, uint256 amount) public payable {
    uint256 supply = communityKeysSupply[keysSubject];
    require(supply != 0, "Community does not exist yet");

    uint256 price = getPrice(supply, amount);
    uint256 fee = fees[keysSubject];
    uint256 subjectFee = price * fee / 1 ether;
    require(msg.value >= price + subjectFee, "Insufficient payment");
    
    communityKeys[keysSubject][msg.sender]++;
    communityKeysSupply[keysSubject]++;
    emit CommunityKeyBought(
      keysSubject,
      msg.sender,
      amount,
      price + subjectFee,
      subjectFee
    );

    address safe = safes[keysSubject];

    (bool success1, ) = safe.call{value: subjectFee}("");

    require(success1, "Funds transfer failed");
  }

  function sellKeys(address keysSubject, uint256 amount) public payable {
    uint256 supply = communityKeysSupply[keysSubject];

    require(supply > amount, "Cannot sell last key");
    require(communityKeys[keysSubject][msg.sender] >= amount, "Insufficient keys");

    uint256 price = getPrice(supply - amount, amount);
    uint256 fee = fees[keysSubject];
    uint256 subjectFee = price * fee / 1 ether;

    communityKeys[keysSubject][msg.sender] -= amount;
    communityKeysSupply[keysSubject] = supply - amount;
    emit CommunityKeySold(
      keysSubject,
      msg.sender,
      amount,
      price - subjectFee,
      subjectFee
    );

    address safe = safes[keysSubject];

    // transfer to the buyer
    (bool success1, ) = msg.sender.call{value: price - subjectFee}("");

    // transfer to the owner
    (bool success2, ) = safe.call{value: subjectFee}("");

    require(success1 && success2, "Funds transfer failed");
  }
}
