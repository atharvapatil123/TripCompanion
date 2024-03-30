import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { useTripCompanionContext } from "../../Context/TripCompanionContext";
import { useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import { styled } from "styled-components";

const Register = () => {
  const navigate = useNavigate();
  // const [name, setName] = useState("");
  // const [bio, setBio] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profileBio, setProfileBio] = useState("");

  const { checkIfWalletConnected, currentAccount } = useAuth();
  const { registerUser, fetchUser } = useTripCompanionContext();

  useEffect(() => {
    checkIfWalletConnected();
    if (currentAccount) {
      checkIfUserIsRegistered();
    }
  }, [currentAccount]);

  const checkIfUserIsRegistered = async () => {
    const user = await fetchUser(currentAccount);
    console.log(user);
    if (user) {
      navigate("/feed");
    }
  };

  const handleRegisterUser = async () => {
    setIsLoading(true);
    await registerUser(profileName, profileBio);
    setIsLoading(false);
    checkIfUserIsRegistered();
  };

  return (
    <HomeContainer>
      <HomeAppContainer>
        <AppHeaderContainer>
          <AppLogo>Trip Companion</AppLogo>
        </AppHeaderContainer>
        <RegisterPageContainer>
          <TextInputGroup>
            <span>Wallet Address</span>
            <CustomInput
              type="text"
              value={currentAccount}
              placeholder="Wallet Address"
            />
          </TextInputGroup>
          <TextInputGroup>
            <span>Full Name</span>
            <CustomInput
              type="text"
              value={profileName}
              onChange={(e) => {
                setProfileName(e.target.value);
              }}
              placeholder="What do we call you?"
            />
          </TextInputGroup>
          {/* <TextInputGroup>
                        <span>Showcase your art</span>
                        <div {...getRootProps({ style })}>
                            <input {...getInputProps()} />
                            <UploadFileOutlined />
                            <p>
                                {profilePicFile != null
                                    ? `${profilePicFile.length} files added`
                                    : "Upload image"}
                            </p>
                        </div>
                    </TextInputGroup> */}
          <TextInputGroup>
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
          </TextInputGroup>
        </RegisterPageContainer>
        <SubmitButton onClick={handleRegisterUser}>
          {isLoading ? <BeatLoader color="#ffffff" /> : "Register"}
        </SubmitButton>
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

export default Register;
