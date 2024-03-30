import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { useTripCompanionContext } from "../../Context/TripCompanionContext";
import { useNavigate } from "react-router-dom";
import { all } from "axios";
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
import { BeatLoader } from "react-spinners";

const Event = () => {
  const navigate = useNavigate();
  const eventId = window.location.pathname.split("/")[2];
  const [event, setEvent] = useState({});
  const [requestedUsers, setRequestedUsers] = useState([]);
  const { checkIfWalletConnected, currentAccount } = useAuth();
  const {
    getEvent,
    acceptUser,
    rejectUser,
    fetchEventRequests,
    giveNFTsToApprovedUsers,
  } = useTripCompanionContext();
  const [isAcceptLoading, setIsAcceptLoading] = useState(false);
  const [isRejectLoading, setIsRejectLoading] = useState(false);
  const [loadingUserAddress, setLoadingUserAddress] = useState(0);

  useEffect(() => {
    checkIfWalletConnected();
    if (currentAccount && eventId) {
      fetchEventDetails();
    }
    // if (currentAccount) fetchUser();
  }, [currentAccount]);

  const fetchEventDetails = async () => {
    console.log("Fetching feed...");
    const eventDetails = await getEvent(eventId);
    setEvent(eventDetails);
    const allRequestedUsers = await fetchEventRequests(eventId);
    console.log(allRequestedUsers);
    console.log(eventDetails);
    setRequestedUsers(allRequestedUsers);
  };

  const handleAcceptUser = async (userAddress) => {
    setLoadingUserAddress(userAddress);
    setIsAcceptLoading(true);
    await acceptUser(eventId, userAddress);
    console.log("User accepted!");
    setIsAcceptLoading(false);
    fetchEventDetails();
  };

  const handleRejectUser = async (userAddress) => {
    setLoadingUserAddress(userAddress);
    setIsRejectLoading(true);
    await rejectUser(eventId, userAddress);
    console.log("User rejected");
    setIsRejectLoading(false);
    fetchEventDetails();
  };

  const giveAllNFTs = async (eventId) => {
    console.log("Ankit data", eventId);
    const userList = await fetchEventRequests(eventId);
    console.log(userList)
    const users = userList.map((user) => user.walletAddress);
    const cins = userList.map((user) => "");
    await giveNFTsToApprovedUsers(eventId, users, cins);
  };

  const renderGiveNFTsButton = (eventId, eventDate, nftsGiven) => {
    if (nftsGiven) return <JoinEventBtn disabled>NFTs Sent</JoinEventBtn>;
    if (!nftsGiven && new Date(eventDate) < new Date()) {
      return (
        <JoinEventBtn
          onClick={() => {
            giveAllNFTs(eventId);
          }}
        >
          Give NFTs
        </JoinEventBtn>
      );
    } else return <JoinEventBtn disabled>Give NFTs</JoinEventBtn>;
  };

  const visitUserProfile = (userAddress) => {
    navigate(`/account/${userAddress}`);
  }

  return (
    <HomeContainer>
      <HomeAppContainer>
        <Sidebar />
        <MainContentContainer>
          <AppHeaderContainer>
            <AppLogo>Trip Companion</AppLogo>
          </AppHeaderContainer>
          <FeedsListContainer>
            <EventCard>
              <EventInfoGroup>
                <EventInfoLabel>Event Name</EventInfoLabel>
                <EventInfoValue>{event.name}</EventInfoValue>
              </EventInfoGroup>
              <EventInfoGroup>
                <EventInfoLabel>Event Description</EventInfoLabel>
                <EventInfoValue>{event.destination}</EventInfoValue>
              </EventInfoGroup>
              <EventInfoGroup>
                <EventInfoLabel>Date</EventInfoLabel>
                <EventInfoValue>{event.date}</EventInfoValue>
              </EventInfoGroup>
              <EventInfoGroup>
                <EventInfoLabel>Initiated by</EventInfoLabel>
                <EventInfoValue>{event.creator}</EventInfoValue>
              </EventInfoGroup>
              <EventActions>
                {renderGiveNFTsButton(
                  event.eventId,
                  event.date,
                  event.nftsGiven
                )}
              </EventActions>
            </EventCard>
            <ListHeader>Requests:</ListHeader>
            {requestedUsers.length > 0 ? (
              <div>
                {requestedUsers.map((user) => {
                  return (
                    <EventCard onClick={ () => visitUserProfile(user.walletAddress)}>
                      <EventInfoGroup>
                        <EventInfoLabel>Name</EventInfoLabel>
                        <EventInfoValue>{user.name}</EventInfoValue>
                      </EventInfoGroup>
                      <EventInfoGroup>
                        <EventInfoLabel>Gender</EventInfoLabel>
                        <EventInfoValue>{user.gender == 1 ? "Male" : "Female"}</EventInfoValue>
                      </EventInfoGroup>
                      <EventInfoGroup>
                        <EventInfoLabel>Date of birth</EventInfoLabel>
                        <EventInfoValue>{user.dob}</EventInfoValue>
                      </EventInfoGroup>
                      <EventInfoGroup>
                        <EventInfoLabel>Wallet Address</EventInfoLabel>
                        <EventInfoValue>{user.walletAddress}</EventInfoValue>
                      </EventInfoGroup>
                      {user.status == 1 &&
                        event.creator.toLowerCase() ===
                          currentAccount.toLowerCase() && (
                          <EventRequestActions>
                            <AcceptBtn
                              disabled={isAcceptLoading || isRejectLoading}
                              onClick={() => {
                                handleAcceptUser(user.walletAddress);
                              }}
                            >
                              {loadingUserAddress === user.walletAddress &&
                              isAcceptLoading ? (
                                <BeatLoader color="#ffffff" />
                              ) : (
                                "Accept"
                              )}
                            </AcceptBtn>
                            <RejectBtn
                              disabled={isAcceptLoading || isRejectLoading}
                              onClick={() => {
                                handleRejectUser(user.walletAddress);
                              }}
                            >
                              {loadingUserAddress === user.walletAddress &&
                              isRejectLoading ? (
                                <BeatLoader color="#ffffff" />
                              ) : (
                                "Reject"
                              )}
                            </RejectBtn>
                          </EventRequestActions>
                        )}
                      {user.status == 2 && (
                        <EventInfoLabelRejected>
                          Rejected
                        </EventInfoLabelRejected>
                      )}
                      {user.status == 3 && (
                        <EventInfoLabelAccepted>
                          Accepted
                        </EventInfoLabelAccepted>
                      )}
                      {/* <EventActions>
                                        {renderJoinButton(event.eventId)}
                                    </EventActions> */}
                    </EventCard>
                  );
                })}
              </div>
            ) : (
              "Looks like you have no requests sent"
            )}
            {/* <OverflowActionButtons>
                                <AddEventBtn onClick={navigateToCreateEvent}>
                                    <Add />
                                </AddEventBtn>
                            </OverflowActionButtons> */}
          </FeedsListContainer>
        </MainContentContainer>
      </HomeAppContainer>
    </HomeContainer>
  );

  return (
    <div>
      <div>
        <div>Name: {event.name}</div>
        <div>Description: {event.destination}</div>
        <div>Date & Time: {event.date}</div>
        <div>By: {event.creator}</div>
        ----------------------
      </div>
      <br />
      Requests:
      {requestedUsers.map((user) => {
        return (
          <div>
            <div>Name: {user.name}</div>
            <div>Date of Birth: {user.dob}</div>
            <div>Gender: {user.gender.toString()}</div>
            <div>Address: {user.walletAddress}</div>
            <div>Status: {user.status}</div>
            {user.status !== 2 && (
              <div>
                <button
                  onClick={() => {
                    handleAcceptUser(user.walletAddress);
                  }}
                >
                  Accept
                </button>
                <button
                  onClick={() => {
                    handleRejectUser(user.walletAddress);
                  }}
                >
                  Reject
                </button>
              </div>
            )}
            ----------------------
          </div>
        );
      })}
    </div>
  );
};

const ListHeader = styled.div`
  margin: 1rem 0;
  font-weight: bold;
  color: #5b5b5b;
`;

const EventRequestActions = styled.div`
  display: flex;
  flex-direction: row;
`;

const EventCard = styled.div`
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: #ffffff;
  border-radius: 12px;
  transition: all 0.5s ease;
  cursor: pointer;
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

const EventInfoLabelAccepted = styled.div`
  font-weight: bold;
  color: green;
  font-size: 0.9rem;
`;

const EventInfoLabelRejected = styled.div`
  font-weight: bold;
  color: #e85d5d;
  font-size: 0.9rem;
`;

const EventInfoValue = styled.div``;

const EventActions = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: end;
`;

const AcceptBtn = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  outline: none;
  border-bottom: #217ebc 6px solid;
  padding: 0.8rem 2rem;
  border-radius: 0.5rem;
  font-size: 1.1rem;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  cursor: pointer;
  transition: all 0.5s ease;
  &:hover {
    transform: translateY(-2px);
  }
  &:active {
    transition: all 0.1s ease;
    transform: translateY(4px);
    border-bottom: 0;
  }
  &:disabled {
    background-color: #919191;
    border-bottom: #6e6e6e 6px solid;
    transform: none;
    cursor: default;
  }
`;

const RejectBtn = styled.button`
  background-color: #db4d34;
  color: white;
  border: none;
  outline: none;
  border-bottom: #b93720 6px solid;
  padding: 0.8rem 2rem;
  border-radius: 0.5rem;
  font-size: 1.1rem;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  cursor: pointer;
  transition: all 0.5s ease;
  &:hover {
    transform: translateY(-2px);
  }
  &:active {
    transition: all 0.1s ease;
    transform: translateY(4px);
    border-bottom: 0;
  }
  &:disabled {
    background-color: #919191;
    border-bottom: #6e6e6e 6px solid;
    transform: none;
    cursor: default;
  }
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
const JoinEventBtn = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  outline: none;
  border-bottom: #217ebc 6px solid;
  padding: 0.8rem 2rem;
  border-radius: 0.5rem;
  font-size: 1.1rem;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.5s ease;
  &:hover {
    transform: translateY(-2px);
  }
  &:active {
    transition: all 0.1s ease;
    transform: translateY(4px);
    border-bottom: 0;
  }
  &:disabled {
    background-color: #919191;
    border-bottom: #6e6e6e 6px solid;
    transform: none;
    cursor: default;
  }
`;

const MainContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  position: relative;
`;

const FeedsListContainer = styled.div`
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

export default Event;
