// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract TripCompanion is ERC721URIStorage {
    using Counters for Counters.Counter;

    Counters.Counter private poapCount;
    struct User {
        bool registered;
        string name;
        string bio;
        address walletAddress;
        uint256 requestStatus;
        bool isVerified;
        uint256 gender;
        bool ageFlag;
        string profilePic;
    }

    struct Event {
        uint256 eventId; // Unique identifier for the event
        string destination;
        string date;
        string name;
        address creator;
        bool nftsGiven;
    }

    event UserEvent(
        bool registered,
        string name,
        string bio,
        address walletAddress,
        uint256 requestStatus,
        bool isVerified,
        uint256 gender,
        bool ageFlag,
        string profilePic
    );

    struct Poap {
        uint256 eventId;
        uint256 itemId;
        address owner;
        string eventName;
        string cid;
    }

    event PoapEvent(
        uint256 eventId,
        uint256 itemId,
        address owner,
        string eventName,
        string cid
    );

    event EventEvent(
        uint256 eventId,
        string destination,
        string date,
        string name,
        address creator,
        bool nftsGiven
    );

    event InterestData(address userAddress, uint256 eventId, uint256 status);

    mapping(address => User) public users;
    User[] public allUserList;
    Event[] public events;
    uint256 public eventIdCounter = 0;
    uint256 hashCount;

    mapping(uint256 => Poap) private poapMapping;
    mapping(uint256 => string) private hashMapping;

    // 0 = not sent
    // 1 = shown interest
    // 2 = rejected
    // 3 = approved
    mapping(address => mapping(uint256 => uint256)) public interested;
    mapping(uint256 => address[]) public eventToUserMapping;
    receive() external payable {}

    constructor() ERC721("TripCompanion", "TPC") {}

    function compareStrings(
        string memory a,
        string memory b
    ) public view returns (bool) {
        return (keccak256(abi.encodePacked((a))) ==
            keccak256(abi.encodePacked((b))));
    }

    function checkHashExists(string memory curHash) public view returns (bool) {
        for (uint256 i = 0; i < hashCount; i++) {
            if (
                keccak256(abi.encodePacked((curHash))) ==
                keccak256(abi.encodePacked((hashMapping[i])))
            ) {
                return true;
            }
        }
        return false;
    }

    // Function to register a user
    function registerUser(
        string memory _name,
        string memory _bio,
        string memory _profilePic
    ) external {
        require(!users[msg.sender].registered, "User already registered");
        users[msg.sender] = User(
            true,
            _name,
            _bio,
            msg.sender,
            0,
            false,
            1,
            false,
            _profilePic
        );
        emit UserEvent(
            true,
            _name,
            _bio,
            msg.sender,
            0,
            false,
            1,
            false,
            _profilePic
        );
        allUserList.push(users[msg.sender]);
    }

    function verifyUser(string memory curHash, uint256 gender, bool ageFlag) public {
        // require(!checkHashExists(curHash), "Hash already exists!");

        users[msg.sender].gender = gender;
        users[msg.sender].ageFlag = ageFlag;
        users[msg.sender].isVerified = true;

        emit UserEvent(
            users[msg.sender].registered,
            users[msg.sender].name,
            users[msg.sender].bio,
            users[msg.sender].walletAddress,
            users[msg.sender].requestStatus,
            true,
            gender,
            ageFlag,
            users[msg.sender].profilePic
        );

        hashMapping[hashCount++] = curHash;
    }

    function updateProfilePic(string memory profilePic) public {
        users[msg.sender].profilePic = profilePic;

        emit UserEvent(
            users[msg.sender].registered,
            users[msg.sender].name,
            users[msg.sender].bio,
            users[msg.sender].walletAddress,
            users[msg.sender].requestStatus,
            users[msg.sender].isVerified,
            users[msg.sender].gender,
            users[msg.sender].ageFlag,
            users[msg.sender].profilePic
        );
    }

    function isUserRegistered() external view returns (bool) {
        if (users[msg.sender].registered == true) {
            return true;
        }
        return false;
    }

    function fetchUser(
        address userAddress
    ) external view returns (User memory) {
        if (users[msg.sender].registered == true) {
            return users[userAddress];
        }
        revert("Not found");
    }

    // Function to create an event
    function createEvent(
        string memory _destination,
        string memory _date,
        string memory _name
    ) external {
        require(users[msg.sender].registered, "User not registered");
        require(users[msg.sender].isVerified, "User not verified");
        events.push(
            Event(eventIdCounter, _destination, _date, _name, msg.sender, false)
        );
        emit EventEvent(
            eventIdCounter,
            _destination,
            _date,
            _name,
            msg.sender,
            false
        );
        eventIdCounter++;
    }

    // Function to show interest in an event
    function showInterest(uint256 _eventId) external {
        require(_eventId < events.length, "Event does not exist");
        require(users[msg.sender].registered, "User not registered");
        require(users[msg.sender].isVerified, "User not verified");
        require(interested[msg.sender][_eventId] == 0, "Already interested");
        require(events[_eventId].creator != msg.sender, "Creator cannot join");

        interested[msg.sender][_eventId] = 1;
        emit InterestData(msg.sender, _eventId, 1);
    }

    function approveInterest(uint256 _eventId, address _user) external {
        require(_eventId < events.length, "Event does not exist");
        require(users[_user].registered, "User not registered");
        require(users[_user].isVerified, "User not verified");
        require(interested[_user][_eventId] == 1, "No interest is shown");
        require(
            msg.sender == events[_eventId].creator,
            "Only an event creator can approve"
        );
        if (events[_eventId].creator != _user) {
            interested[_user][_eventId] = 3;
            emit InterestData(_user, _eventId, 3);
        }
    }

    function rejectInterest(uint256 _eventId, address _user) external {
        require(_eventId < events.length, "Event does not exist");
        require(users[_user].registered, "User not registered");
        require(users[_user].isVerified, "User not verified");
        require(interested[_user][_eventId] == 1, "No interest is shown");
        require(
            msg.sender == events[_eventId].creator,
            "Only an event creator can reject"
        );
        if (events[_eventId].creator != _user) {
            interested[_user][_eventId] = 2;
            emit InterestData(_user, _eventId, 2);
        }
    }

    function getEvents(address _user) external view returns (Event[] memory) {
        uint256 count = 0;

        for (uint256 i = 0; i < events.length; i++) {
            if (events[i].creator == _user) {
                count++;
            }
        }

        // Trim the array to remove any unused slots
        Event[] memory trimmedList = new Event[](count);
        count = 0;
        for (uint256 j = 0; j < events.length; j++) {
            if (events[j].creator == _user) {
                trimmedList[count] = events[j];
                count++;
            }
        }

        return trimmedList;
    }

    function getAllEvents() external view returns (Event[] memory) {
        return events;
    }

    function getInterestedEvents() external view returns (Event[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < events.length; i++) {
            if (interested[msg.sender][events[i].eventId] == 1) {
                count++;
            }
        }
        Event[] memory interestedEventList = new Event[](count);
        count = 0;
        for (uint256 i = 0; i < events.length; i++) {
            if (interested[msg.sender][events[i].eventId] == 1) {
                interestedEventList[count] = events[i];
                count++;
            }
        }
        return interestedEventList;
    }

    function getRejectedEvents() external view returns (Event[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < events.length; i++) {
            if (interested[msg.sender][events[i].eventId] == 2) {
                count++;
            }
        }
        Event[] memory interestedEventList = new Event[](count);
        count = 0;
        for (uint256 i = 0; i < events.length; i++) {
            if (interested[msg.sender][events[i].eventId] == 2) {
                interestedEventList[count] = events[i];
                count++;
            }
        }
        return interestedEventList;
    }

    function mint(
        uint256 eventId,
        address userAddress,
        string memory eventName,
        string memory tokenURI
    ) public {
        poapCount.increment();
        uint256 newPoapId = poapCount.current();

        _mint(msg.sender, newPoapId);
        _setTokenURI(newPoapId, tokenURI);

        poapMapping[newPoapId] = Poap({
            eventId: eventId,
            itemId: newPoapId,
            eventName: eventName,
            owner: userAddress,
            cid: tokenURI
        });

        emit PoapEvent(eventId, newPoapId, userAddress, eventName, tokenURI);
    }

    function giveNFTsToApprovedUsers(
        uint256 eventId,
        address[] memory users,
        string[] memory tokenURI
    ) public {
        for (uint256 i = 0; i < users.length; i++) {
            mint(eventId, users[i], events[eventId].name, tokenURI[i]);
        }
        events[eventId].nftsGiven = true;

        emit EventEvent(
            eventId,
            events[eventId].destination,
            events[eventId].date,
            events[eventId].name,
            events[eventId].creator,
            true
        );
    }

    function getApprovedEvents() external view returns (Event[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < events.length; i++) {
            if (interested[msg.sender][events[i].eventId] == 3) {
                count++;
            }
        }
        Event[] memory interestedEventList = new Event[](count);
        count = 0;
        for (uint256 i = 0; i < events.length; i++) {
            if (interested[msg.sender][events[i].eventId] == 3) {
                interestedEventList[count] = events[i];
                count++;
            }
        }
        return interestedEventList;
    }

    function getInterestedUsers(
        uint256 _eventId
    ) external view returns (User[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < allUserList.length; i++) {
            if (interested[allUserList[i].walletAddress][_eventId] == 1) {
                count++;
            }
        }
        User[] memory interestedUsers = new User[](count);
        count = 0;
        for (uint256 i = 0; i < allUserList.length; i++) {
            if (interested[allUserList[i].walletAddress][_eventId] == 1) {
                interestedUsers[count] = allUserList[i];
                count++;
            }
        }
        return interestedUsers;
    }

    function getRejectedUsers(
        uint256 _eventId
    ) external view returns (User[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < allUserList.length; i++) {
            if (interested[allUserList[i].walletAddress][_eventId] == 2) {
                count++;
            }
        }
        User[] memory interestedUsers = new User[](count);
        count = 0;
        for (uint256 i = 0; i < allUserList.length; i++) {
            if (interested[allUserList[i].walletAddress][_eventId] == 2) {
                interestedUsers[count] = allUserList[i];
                count++;
            }
        }
        return interestedUsers;
    }

    function getApprovedUsers(
        uint256 _eventId
    ) external view returns (User[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < allUserList.length; i++) {
            if (interested[allUserList[i].walletAddress][_eventId] == 3) {
                count++;
            }
        }
        User[] memory interestedUsers = new User[](count);
        count = 0;
        for (uint256 i = 0; i < allUserList.length; i++) {
            if (interested[allUserList[i].walletAddress][_eventId] == 3) {
                interestedUsers[count] = allUserList[i];
                count++;
            }
        }
        return interestedUsers;
    }

    function getEventOwner(uint256 _eventId) external view returns (address) {
        require(_eventId < events.length, "Event does not exist");
        return events[_eventId].creator;
    }

    // Function to get event details
    function getEvent(uint256 _eventId) external view returns (Event memory) {
        require(_eventId < events.length, "Event does not exist");
        Event memory eventDetails = events[_eventId];
        return eventDetails;
    }
}
