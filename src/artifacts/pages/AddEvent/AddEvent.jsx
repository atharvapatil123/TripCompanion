import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { useTripCompanionContext } from "../../Context/TripCompanionContext";
import { styled } from "styled-components";
import { BeatLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";

const AddEvent = () => {
    const navigate = useNavigate();
	const [eventName, setEventName] = useState("");
	const [eventDesc, setEventDesc] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [isLoading, setIsLoading] = useState(false);

	const { checkIfWalletConnected, currentAccount } = useAuth();
	const {createEvent} = useTripCompanionContext();

	useEffect(() => {
		checkIfWalletConnected();
		// if (currentAccount) fetchUser();
	}, [currentAccount]);

	const handleCreateEvent = async () => {
        setIsLoading(true);
		await createEvent(
			eventName,
			eventDesc,
			eventDate
		);
        setIsLoading(false);
        navigate("/feed");
	}

    return (
        <HomeContainer>
            <HomeAppContainer>
            <Sidebar />
            <MainContentContainer>
                <AppHeaderContainer>
                    <AppLogo>Trip Companion</AppLogo>
                </AppHeaderContainer>
                <RegisterPageContainer>
                    
                    <TextInputGroup>
                        <span>Event Name</span>
                        <CustomInput
                            type="text"
                            value={eventName}
                            onChange={(e) => {
                                setEventName(e.target.value);
                            }}
                            placeholder="Give a name to your event"
                        />
                    </TextInputGroup>
                    <TextInputGroup>
                        <span>Event Description</span>
                        <CustomInputTextArea
                            type="textfield"
                            value={eventDesc}
                            onChange={(e) => {
                                setEventDesc(e.target.value);
                            }}
                            placeholder="Describe your event"
                            rows={4}
                        />
                    </TextInputGroup>
                    <TextInputGroup>
                        <span>Event Date</span>
                        <CustomInput
                            type="date"
                            value={eventDate}
                            onChange={(e) => {
                                setEventDate(e.target.value);
                            }}
                            placeholder="When is it happening?"
                        />
                    </TextInputGroup>
                    {/* <TextInputGroup>
                        <span>Gender</span>
                        <RadioButtonWithLabel>
                            <input
                                type="radio"
                                value="Male"
                                checked={profileGender === "1"}
                                onChange={(e) => {
                                    setProfileGender("1");
                                }}
                            />{" "}
                            Male
                        </RadioButtonWithLabel>
                        <RadioButtonWithLabel>
                            <input
                                type="radio"
                                value="Female"
                                checked={profileGender === "0"}
                                onChange={(e) => {
                                    setProfileGender("0");
                                }}
                            />{" "}
                            Female
                        </RadioButtonWithLabel>
                    </TextInputGroup> */}
                    {/* <TextInputGroup>
                        <span>Bio</span>
                        <CustomInputTextArea
                            type="textfield"
                            value={profileBio}
                            onChange={(e) => {
                                setProfileBio(e.target.value);
                            }}
                            placeholder="Write something cool about yourself"
                            rows={4}
                        />
                    </TextInputGroup> */}
                </RegisterPageContainer>
                <SubmitButton onClick={handleCreateEvent}>
                    {isLoading ? <BeatLoader color="#ffffff" /> : "Create"}
                </SubmitButton>
                </MainContentContainer>
            </HomeAppContainer>
        </HomeContainer>
    );

	// return (<div>
	// 	Event Name:
	// 	<input value={eventName} onChange={(e) => {setEventName(e.target.value)}} type="text" name="" id="" />
	// 	Event Description:
	// 	<input value={eventDesc} onChange={(e) => {setEventDesc(e.target.value)}} type="text" name="" id="" />
	// 	Event Date & Time:
    //     <input type="text" value={eventDate} onChange={(e) => {setEventDate(e.target.value)}} name="" id="" />
    //     Event Creator:
	// 	<input type="text" value={currentAccount} name="" id="" />
        
	// 	<button onClick={() => {
	// 		handleCreateEvent();
	// 	}}>Create Event</button>
	// </div>)
};

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

const AppHeaderContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const AppLogo = styled.div`
    color: #3498db;
    /* font-family: "Pacifico", cursive; */
    font-size: 1.4rem;
`;

const RegisterPageContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-y: auto;
    padding: 1rem 0;
`;

const MainContentContainer = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    position: relative;
`;

const TextInputGroup = styled.div`
    background-color: #e7e7e7;
    border-radius: 6px;
    border: none;
    outline: none;
    padding: 0.8rem 1rem;
    font-size: 1rem;
    margin-bottom: 0.5rem;
    flex-direction: column;
    display: flex;

    span {
        font-size: 0.9rem;
        font-weight: bold;
        margin-bottom: 0.6rem;
        color: #444444;
    }
`;

const CustomInput = styled.input`
    background-color: transparent;
    border: none;
    outline: none;
    font-size: 1.1rem;
`;

const CustomInputTextArea = styled.textarea`
    background-color: transparent;
    border: none;
    outline: none;
    font-size: 1rem;
    resize: none;
    font-family: "Noto Sans", sans-serif;
`;

const SubmitButton = styled.button`
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
`;

const RadioButtonWithLabel = styled.div`
    display: flex;
    flex-direction: row;
`;

export default AddEvent;
