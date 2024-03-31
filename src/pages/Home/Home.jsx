import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { useTripCompanionContext } from "../../Context/TripCompanionContext";
import { styled } from "styled-components";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();
	const [name, setName] = useState("");
	const [age, setAge] = useState("");
	const [gender, setGender] = useState("");
	const [bio, setBio] = useState("");

	const { checkIfWalletConnected, currentAccount } = useAuth();
	const {fetchUserByAddress} = useTripCompanionContext();

	useEffect(() => {
		checkIfWalletConnected();
		if(currentAccount){
			checkIfUserIsRegistered();
		}
	}, [currentAccount]);

    const checkIfUserIsRegistered = async () => {
        const user = await fetchUserByAddress(currentAccount);
        console.log(user);
        if(user && user.isVerified){
            navigate("/feed");
        }else if(user && !user.isVerified){
            navigate("/anonverify");
        }
    }

    const handleNavigateToRegister = () => {
        navigate("/register");
    }

	return (
        <HomeContainer>
            <HomeAppContainer>
                <AppInfo>
                    <AppLogo>Companion</AppLogo>
                    <AppSlogan>Connecting People <br/>who love to travel!</AppSlogan>
                </AppInfo>
                <WalletConnectContainer>
                    <ConnectWallet onClick={handleNavigateToRegister}>Register</ConnectWallet>
                </WalletConnectContainer>
            </HomeAppContainer>
        </HomeContainer>
    );
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
    background-image: linear-gradient(#3498db, #2980b9);
    box-shadow: #00000052 5px 5px 30px;
    width: max(30%, 400px);
    height: 90%;
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    padding: 1rem;
`;

const AppInfo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const AppLogo = styled.div`
    color: white;
    font-family: "Pacifico", cursive;
    font-size: 4rem;
    text-align: center;
`;

const AppSlogan = styled.div`
    color: white;
    font-size: 1.5rem;
    text-align: center;
`;

const WalletConnectContainer = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const ConnectWallet = styled.button`
    background-color: #ffffff;
    color: #3498db;
    border: none;
    outline: none;
    border-bottom: #c0c0c0 6px solid;
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

export default Home;
