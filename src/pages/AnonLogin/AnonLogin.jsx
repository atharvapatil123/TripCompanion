import React, { useEffect, useState, useCallback } from 'react'
import { useAuth } from "../../Context/AuthContext";
import { toast } from "react-toastify";
import {
	AnonAadhaarProof,
	LogInWithAnonAadhaar,
	useAnonAadhaar,
	useProver,
} from "@anon-aadhaar/react";
import { useNavigate } from "react-router-dom";
import { useTripCompanionContext } from "../../Context/TripCompanionContext";
// import { BeatLoader } from "react-spinners";
import { styled } from "styled-components";
// import { useSafeBuyContext } from "../../Context/SafeBuyContext";



const AnonLogin = () => {

	const [anonAadhaar] = useAnonAadhaar();
	const [, latestProof] = useProver();
	const navigate = useNavigate();
	const { checkIfWalletConnected, currentAccount } = useAuth();
	const [profileDob, setProfileDob] = useState("");
	const [profileGender, setProfileGender] = useState("0");
	const { verifyUser, fetchUserByAddress } = useTripCompanionContext();


	useEffect(() => {
		checkIfWalletConnected();
		if (currentAccount) fetchUser();
	}, [currentAccount]);

	useEffect(() => {
		handleAnon();
	}, [latestProof])

	const handleAnon = async () => {
		if (latestProof && profileGender !== "0") {
			
			const anonData = JSON.parse(latestProof);
			console.log(anonData)
			if (anonData?.proof.ageAbove18) {
				console.log(anonData.proof.ageAbove18);
				console.log(anonData.proof.signalHash);
				console.log(profileGender);

				if (anonData.proof.gender === "77" && profileGender === "1" || anonData?.proof.gender === "70" && profileGender === "0") {
					console.log("Verify User...")
					try{
						const receipt = await verifyUser(
							anonData?.proof.signalHash,
							parseInt(profileGender),
							anonData?.proof.ageAbove18
						);
					} catch(er){
						console.log(er);
					}
					
					// console.log(receipt);
					console.log("user verified.")
					toast.success("User verified successfully");
					fetchUser();
				}
				else {
					alert("Please enter correct gender.")
					console.log("Incorrect Gender")
				}
			}
			else {
				alert("Only users 18 or above are allowed")
				navigate("/register");
				console.log("PDF")
			}
		}
	}

	const fetchUser = useCallback(async () => {
		try {
			const user = await fetchUserByAddress(currentAccount);
			console.log(user);
			if (user && user.isVerified) {
				navigate("/register");
			}
		} catch (err) {
			console.log(err)
			console.log("User cannot be fetched")
		}
	});

	const [userGender, setUserGender] = useState("")
	const handleGenderChange = (event) => {
		setUserGender(event.target.value);
		console.log(userGender, "gg") // Update the state with the new value
	};

	return (
		<HomeContainer>
			<HomeAppContainer>
				<AppHeaderContainer>
					<AppLogo>Trip Companion</AppLogo>
				</AppHeaderContainer>
				<RegisterPageContainer>

					<TextInputGroup>
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
					</TextInputGroup>

				</RegisterPageContainer>
				<LogInWithAnonAadhaar nullifierSeed={1234} fieldsToReveal={["revealAgeAbove18", "revealGender"]} />

				<div className="flex flex-col items-center gap-4 rounded-2xl max-w-screen-sm mx-auto p-8">
					{anonAadhaar.status === "logged-in" && (
						<>
							{latestProof && (
								<AnonAadhaarProof
									code={JSON.stringify(JSON.parse(latestProof), null, 2)}
								/>
							)}
						</>
					)}
				</div>
			</HomeAppContainer>
		</HomeContainer>

	)
}


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
    width: max(30%, 400px);
    height: 90%;
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    padding: 1rem;
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


export default AnonLogin