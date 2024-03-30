// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract TripCompanion {
    struct User {
        bool registered;
        string name;
        string dob;
        uint256 gender;
        string bio;
        address walletAddress;
        uint256 requestStatus;
        bool isVerified;
    }

    struct Event {
        uint256 eventId; // Unique identifier for the event
        string destination;
        string date;
        string name;
        address creator;
        address[] matches;
    }

    event UserEvent (
        bool registered,
        string name,
        string dob,
        uint256 gender,
        string bio,
        address walletAddress,
        uint256 requestStatus,
        bool isVerified
    );

    event EventEvent (
        uint256 eventId, 
        string destination,
        string date,
        string name,
        address creator
    );

    event InterestData(
        address userAddress,
        uint256 eventId,
        uint256 status
    );

    mapping(address => User) public users;
    User[] public allUserList;
    Event[] public events;
    uint256 public eventIdCounter = 0;

    // 0 = not sent
    // 1 = shown interest
    // 2 = rejected
    // 3 = approved
    mapping(address => mapping(uint256 => uint256)) public interested;
    mapping(uint256 => address[]) public eventToUserMapping;

    // Function to register a user
    function registerUser(string memory _name, string memory _dob, uint256 gender, string memory _bio) external {
        require(!users[msg.sender].registered, "User already registered");
        users[msg.sender] = User(true, _name, _dob, gender, _bio, msg.sender, 0, false);
        emit UserEvent(true, _name, _dob, gender, _bio, msg.sender, 0, false);
        allUserList.push(users[msg.sender]);
    }

    function isUserRegistered() external view returns(bool) {
        if(users[msg.sender].registered == true){
            return true;
        }
        return false;
    }

    function fetchUser(address userAddress) external view returns(User memory) {
        if(users[msg.sender].registered == true){
            return users[userAddress];
        }
        revert("Not found");
    }

    // Function to create an event
    function createEvent(string memory _destination, string memory _date, string memory _name) external {
        require(users[msg.sender].registered, "User not registered");
        //require(users[msg.sender].isVerified, "User not verified");
        address[] memory matches;
        events.push(Event(eventIdCounter, _destination, _date, _name, msg.sender, matches));
        emit EventEvent(eventIdCounter, _destination, _date, _name, msg.sender);
        eventIdCounter++;
    }

    // Function to show interest in an event
    function showInterest(uint256 _eventId) external {
        require(_eventId < events.length, "Event does not exist");
        require(users[msg.sender].registered, "User not registered");
        //require(users[msg.sender].isVerified, "User not verified");
        require(interested[msg.sender][_eventId] == 0, "Already interested");
        require(events[_eventId].creator != msg.sender, "Creator cannot join");
        
        interested[msg.sender][_eventId] = 1;
        // events[_eventId].matches.push(msg.sender);
        emit InterestData(msg.sender, _eventId, 1);

    }

    function approveInterest(uint256 _eventId, address _user) external{
        require(_eventId < events.length, "Event does not exist");
        require(users[_user].registered, "User not registered");
        //require(users[_user].isVerified, "User not verified");
        require(interested[_user][_eventId] == 1, "No interest is shown");
        require(msg.sender == events[_eventId].creator, "Only an event creator can approve");
        if (events[_eventId].creator != _user) {
            events[_eventId].matches.push(_user);
            interested[_user][_eventId] = 3;
            emit InterestData(_user, _eventId, 3);
            //users[_user].requestStatus = 1;
        }
    }

    function rejectInterest(uint256 _eventId, address _user) external{
        require(_eventId < events.length, "Event does not exist");
        require(users[_user].registered, "User not registered");
        //require(users[_user].isVerified, "User not verified");
        require(interested[_user][_eventId] == 1, "No interest is shown");
        require(msg.sender == events[_eventId].creator, "Only an event creator can reject");
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

    function getAllEvents() external view returns (Event[] memory){
        return events;
    }

    function getInterestedEvents() external view returns (Event[] memory){
        uint256 count=0;
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

    function getRejectedEvents() external view returns (Event[] memory){
        uint256 count=0;
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

    function getApprovedEvents() external view returns (Event[] memory){
        uint256 count=0;
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

    function getInterestedUsers(uint256 _eventId) external view returns (User[] memory){
        uint256 count=0;
        for(uint256 i=0; i<allUserList.length;i++){
            if(interested[allUserList[i].walletAddress][_eventId] == 1){
                count++;
            }
        }
        User[] memory interestedUsers = new User[](count);
        count = 0;
        for(uint256 i=0; i<allUserList.length;i++){
            if(interested[allUserList[i].walletAddress][_eventId] == 1){
                interestedUsers[count] = allUserList[i];
                count++;
            }
        }
        return interestedUsers;
    }

    function getRejectedUsers(uint256 _eventId) external view returns (User[] memory){
        uint256 count=0;
        for(uint256 i=0; i<allUserList.length;i++){
            if(interested[allUserList[i].walletAddress][_eventId] == 2){
                count++;
            }
        }
        User[] memory interestedUsers = new User[](count);
        count = 0;
        for(uint256 i=0; i<allUserList.length;i++){
            if(interested[allUserList[i].walletAddress][_eventId] == 2){
                interestedUsers[count] = allUserList[i];
                count++;
            }
        }
        return interestedUsers;
    }

    function getApprovedUsers(uint256 _eventId) external view returns (User[] memory){
        uint256 count=0;
        for(uint256 i=0; i<allUserList.length;i++){
            if(interested[allUserList[i].walletAddress][_eventId] == 3){
                count++;
            }
        }
        User[] memory interestedUsers = new User[](count);
        count = 0;
        for(uint256 i=0; i<allUserList.length;i++){
            if(interested[allUserList[i].walletAddress][_eventId] == 3){
                interestedUsers[count] = allUserList[i];
                count++;
            }
        }
        return interestedUsers;
    }

    // Function to fetch all matches for a particular event
    function getMatches(uint256 _eventId) external view returns (address[] memory) {
        require(_eventId < events.length, "Event does not exist");
        return events[_eventId].matches;
    }

    function getEventOwner(uint256 _eventId) external view returns (address){
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