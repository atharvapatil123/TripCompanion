import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { useTripCompanionContext } from "../../Context/TripCompanionContext";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import HomeIcon from "@mui/icons-material/Home";
import {
  Add,
  Chat,
  Close,
  ErrorOutlineOutlined,
  Favorite,
  HeatPumpRounded,
  Person,
} from "@mui/icons-material";
import Sidebar from "../Sidebar/Sidebar";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState([]);
  const [poaps, setPOAPs] = useState([]);
  const [requestedEvents, setRequestedEvents] = useState([]);
  const { checkIfWalletConnected, currentAccount } = useAuth();
  const { fetchUser, fetchUserNFTs } = useTripCompanionContext();

  useEffect(() => {
    checkIfWalletConnected();
    if (currentAccount) {
      fetchCurrentUser();
      getPOAP();
    }
    // if (currentAccount) fetchUser();
  }, [currentAccount]);

  const fetchCurrentUser = async () => {
    const currentUrl = window.location.href;
    const pathSegments = currentUrl.split('/');
    let account ="";
    console.log(pathSegments)
    if(pathSegments.length == 5){
      console.log(pathSegments[4], "new")
      account = pathSegments[4]; // Index 4 because 0-based index
    }else{
      account=currentAccount;
    }
    const currUser = await fetchUser(account);
      console.log("Fetching Current User...", currUser);
    setUser(currUser);
  };

  const getPOAP = async () => {    
    const myPOAP = await fetchUserNFTs(currentAccount);
    console.log("My POAP: ", myPOAP);
    setPOAPs(myPOAP);
  };

  const navigateToCreateEvent = () => {
    navigate("/addEvent");
  };

  const navigateToMyEvents = () => {
    navigate("/myEvents");
  };

  return (
    <HomeContainer>
      <HomeAppContainer>
        <Sidebar />
        <MainContentContainer>
          <AppHeaderContainer>
            <AppLogo>Trip Companion</AppLogo>
          </AppHeaderContainer>
          <EventCard>
            <EventInfoGroup>
              <EventInfoLabel>Name</EventInfoLabel>
              <EventInfoValue>{user.name}</EventInfoValue>
            </EventInfoGroup>
            <EventInfoGroup>
              <EventInfoLabel>Bio</EventInfoLabel>
              <EventInfoValue>{user.bio}</EventInfoValue>
            </EventInfoGroup>
            <EventInfoGroup>
              <EventInfoLabel>Gender</EventInfoLabel>
              <EventInfoValue>{user.gender == 1 ? "Male" : "Female"}</EventInfoValue>
            </EventInfoGroup>
            <EventInfoGroup>
              <EventInfoLabel>Wallet Address</EventInfoLabel>
              <EventInfoValue>{user.walletAddress}</EventInfoValue>
            </EventInfoGroup>
            <EventInfoGroup>
              <EventInfoLabel>Is Verified?</EventInfoLabel>
              <EventInfoValue>{!user.isVerified ? "false" : "true"}</EventInfoValue>
            </EventInfoGroup>
          </EventCard>
          <ListHeader>My NFTs:</ListHeader>
          {poaps.length > 0 ? poaps.map((poap) => (
            <EventCard>
              <EventInfoGroup>
                <EventInfoLabel>Event ID</EventInfoLabel>
                <EventInfoValue>{poap.eventId}</EventInfoValue>
              </EventInfoGroup>
              <EventInfoGroup>
                <EventInfoLabel>Item ID</EventInfoLabel>
                <EventInfoValue>{poap.itemId}</EventInfoValue>
              </EventInfoGroup>
              <EventInfoGroup>
                <EventInfoLabel>Owner</EventInfoLabel>
                <EventInfoValue>{poap.owner}</EventInfoValue>
              </EventInfoGroup>
              <EventInfoGroup>
                <EventInfoLabel>Event name</EventInfoLabel>
                <EventInfoValue>{poap.eventName}</EventInfoValue>
              </EventInfoGroup>
            </EventCard>
          )) : <EventCard>No NFTs found</EventCard>}
        </MainContentContainer>
      </HomeAppContainer>
    </HomeContainer>
  );
};

const ListHeader = styled.div`
  margin: 1rem 0;
  font-weight: bold;
  color: #5b5b5b;
`;

const EventCard = styled.div`
  margin: 1rem 0;
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: #ffffff;
  border-radius: 12px;
  transition: all 0.5s ease;
  &:hover {
    transform: translateY(-2px);
  }
`;

const EventInfoGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 0.4rem;
`;

const EventInfoLabel = styled.div`
  font-weight: bold;
  color: #3498db;
  font-size: 0.9rem;
`;

const EventInfoValue = styled.div``;

const EventActions = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: end;
`;

const HomeContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: "Noto Sans", sans-serif;
`;

const HomeAppContainer = styled.div`
  background-color: #f4f4f4;
  box-shadow: #00000052 5px 5px 30px;
  width: max(30%, 550px);
  height: 90%;
  border-radius: 1rem;
  display: flex;
  flex-direction: row;
  align-items: stretch;
`;

const SideBarNavigationContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem 1rem;
  background-color: #3498db;
  border-radius: 1rem 0 0 1rem;
  color: white;
`;

const NavOption = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 0.8rem;
  border-radius: 0.5rem;
  padding: 0.8rem;
  cursor: pointer;
  &:hover {
    background-color: #ffffff36;
  }
`;

const FlexFullContainer = styled.div`
  flex: 1;
`;

const MainContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  position: relative;
`;

const FeedsListContainer = styled.div`
  padding: 20px 10px 20px 20px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  flex: 1;
`;

const AppHeaderContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const AppLogo = styled.div`
  color: #3498db;
  font-family: "Pacifico", cursive;
  font-size: 1.4rem;
`;

const ProfileContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
  padding: 1rem 0;
`;

const MainProfileImage = styled.img`
  width: 100%;
  border-radius: 1rem;
`;

const ProfileInfoContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: end;
  padding: 0.5rem 0;
`;

const ProfileName = styled.span`
  font-weight: bold;
  font-size: 1.3rem;
  padding-right: 0.5rem;
`;

const ProfileGender = styled.span`
  font-weight: 600;
`;
const ProfileAge = styled.span`
  font-weight: 600;
`;

const ProfileWriteUpContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 1rem 0;
`;

const WriteUpQuestion = styled.div`
  font-weight: bold;
  padding-bottom: 0.4rem;
`;

const WriteUpAnswer = styled.div``;

const AdditionContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem 0;
`;

const OverflowActionButtons = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
  flex-direction: row;
`;

const SkipButton = styled.div`
  background-color: white;
  border: none;
  outline: none;
  margin: 0.5rem;
  margin-left: 0rem;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
`;

const AddEventBtn = styled.div`
  background-color: #3498db;
  border: none;
  outline: none;
  color: white;
  margin: 0.5rem;
  margin-left: 0rem;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
`;

export default Dashboard;
