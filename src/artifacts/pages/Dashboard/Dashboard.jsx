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
	const [myEvents, setMyEvents] = useState([]);
    const [requestedEvents, setRequestedEvents] = useState([]);
	const { checkIfWalletConnected, currentAccount } = useAuth();
	const {fetchMyEvents, fetchMyRequests} = useTripCompanionContext();

	useEffect(() => {
		checkIfWalletConnected();
        if(currentAccount){
            fetchEventsForDashboard();
        }
		// if (currentAccount) fetchUser();
	}, [currentAccount]);

	const fetchEventsForDashboard = async () => {
        console.log("Fetching feed...")
		const allMyEvents = await fetchMyEvents();
        const allRequestedEvents = await fetchMyRequests();
        setMyEvents(allMyEvents);
        setRequestedEvents(allRequestedEvents);
	}



    const navigateToCreateEvent = () => {
        navigate("/addEvent");
    }

    const navigateToMyEvents = () => {
        navigate("/myEvents");
    }

    const handleNavigateToEvent = (eventId) => {
        navigate(`/event/${eventId}`)
    }

    const renderStatusText = (status) => {
        let statusText = "";
        switch(status){
            case 1:
               statusText = "Pending"; 
               break;
            case 2:
               statusText = "Rejected"; 
               break;
            case 3:
                statusText = "Approved"; 
                break;
        }
        return statusText;
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
                    <ListHeader>My Events:</ListHeader>
                    {myEvents.length > 0 ? (
                        <div>
                        
                        {
                            myEvents.map((event) => {
                                return <EventCard onClick={() => {
                                    handleNavigateToEvent(event.eventId);
                                }}>
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
                                    {/* <EventActions>
                                        {renderJoinButton(event.eventId)}
                                    </EventActions> */}
                            </EventCard>
                            })
                        }
                        </div>
                        
                    ) : (
                        "Looks like you have no events created!"
                    )}
                    <ListHeader>My Requests:</ListHeader>
                    {requestedEvents.length > 0 ? (
                        <div>
                        
                        {
                            requestedEvents.map((event) => {
                                return <EventCard>
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
                                    <EventInfoGroup>
                                        <EventInfoLabel>Status</EventInfoLabel>
                                        <EventInfoValue>{renderStatusText(event.status)}</EventInfoValue>
                                    </EventInfoGroup>
                                    {/* <EventActions>
                                        {renderJoinButton(event.eventId)}
                                    </EventActions> */}
                            </EventCard>
                            })
                        }
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

	
};

const ListHeader = styled.div`
    margin: 1rem 0;
    font-weight: bold;
    color: #5b5b5b;
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

const EventInfoValue = styled.div`

`;

const EventActions = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: end;
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
