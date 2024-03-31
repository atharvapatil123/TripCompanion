import React, { useContext } from "react";
import { ethers } from "ethers";
import Wenb3Model from "web3modal";
import { TripCompanionAddress, TripCompanionABI } from "./constants";
import { useAuth } from "./AuthContext";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const fetchContract = (signerOrProvider) =>
  new ethers.Contract(TripCompanionAddress, TripCompanionABI, signerOrProvider);

export const TripCompanionContext = React.createContext();

export const useTripCompanionContext = () => useContext(TripCompanionContext);
const APIURL =
  "https://api.studio.thegraph.com/query/69527/trip_companion/v0.0.11";

export const TripCompanionProvider = ({ children }) => {
  const { currentAccount } = useAuth();

  const connectingWithSmartContract = async () => {
    try {
      const web3Modal = new Wenb3Model();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);
      return contract;
    } catch (error) {
      console.log("Something went wrong while connecting with contract!");
    }
  };

  const registerUser = async (name, bio) => {
    const contract = await connectingWithSmartContract();
    console.log(contract);
    if (currentAccount) {
      console.log(currentAccount);
      const transaction = await contract.registerUser(name, bio,"");
      const transactionReceipt = await transaction.wait();
      console.log(transactionReceipt);
    }
  };

  const verifyUser = async (hash,gender,ageAbove18) => {
    console.log("Verify user context called")
    const contract = await connectingWithSmartContract();
    if (currentAccount) {
      console.log(currentAccount);
      const transaction = await contract.verifyUser(hash,gender,ageAbove18);
      
      const receipt = await transaction.wait();
      return receipt;
    }
    return "No account";
  };

  const fetchUserByAddress = async (userAddress) => {
    console.log(userAddress);
    const query = `query MyQuery {
		userEvents(
		  orderBy: blockTimestamp
		  orderDirection: desc
		  first: 1
		  where: {walletAddress: "${userAddress}"}
		) {
		  bio
		  blockNumber
		  blockTimestamp
		  id
		  isVerified
		  name
		  requestStatus
		  transactionHash
		  registered
		  walletAddress
      gender
		}
	  }`;

    const client = new ApolloClient({
      uri: APIURL,
      cache: new InMemoryCache(),
    });

    const res = await client.query({ query: gql(query) });
    console.log(res);
    if (res.data.userEvents.length === 0) {
      return null;
    }
    return res.data.userEvents[0];
  };

  const createEvent = async (eventName, eventDesc, eventDate) => {
    const contract = await connectingWithSmartContract();
    if (currentAccount) {
      const transaction = await contract.createEvent(
        eventDesc,
        eventDate,
        eventName
      );
      const transactionReceipt = await transaction.wait();
      console.log(transactionReceipt);
    }
  };

  const fetchAllEvents = async () => {
    const query = `
	query MyQuery {
		eventEvents {
		  blockNumber
		  blockTimestamp
		  creator
		  date
		  destination
		  eventId
		  id
		  transactionHash
		  name
		  nftsGiven
		}
	  }`;
    const client = new ApolloClient({
      uri: APIURL,
      cache: new InMemoryCache(),
    });

    const res = await client.query({ query: gql(query) });

    const events = res.data.eventEvents;
    let latestEvents = {};

    events.forEach((event) => {
      if (
        !latestEvents[event.eventId] ||
        parseInt(event.blockTimestamp) >
          parseInt(latestEvents[event.eventId].blockTimestamp)
      ) {
        latestEvents[event.eventId] = event;
      }
    });
    return Object.values(latestEvents);
  };

  const fetchMyEvents = async () => {
    const query = `
	query MyQuery {
		eventEvents(where: {creator: "${currentAccount}"}) {
		  blockNumber
		  blockTimestamp
		  creator
		  date
		  destination
		  eventId
		  id
		  transactionHash
		  name
		  nftsGiven
		}
	  }`;
    const client = new ApolloClient({
      uri: APIURL,
      cache: new InMemoryCache(),
    });

    const res = await client.query({ query: gql(query) });

    const events = res.data.eventEvents;
    let latestEvents = {};

    events.forEach((event) => {
      if (
        !latestEvents[event.eventId] ||
        parseInt(event.blockTimestamp) >
          parseInt(latestEvents[event.eventId].blockTimestamp)
      ) {
        latestEvents[event.eventId] = event;
      }
    });
    return Object.values(latestEvents);
  };

  const giveNFTsToApprovedUsers = async (eventId, users, cins) => {
    const contract = await connectingWithSmartContract();
    console.log(users);
    console.log(eventId, cins);
    if (currentAccount) {
      const transaction = await contract.giveNFTsToApprovedUsers(
        eventId,
        users,
        cins
      );
      const transactionReceipt = await transaction.wait();
      console.log(transactionReceipt);
    }
  };

  const joinEvent = async (eventId) => {
    const contract = await connectingWithSmartContract();
    if (currentAccount) {
      const transaction = await contract.showInterest(eventId);
      const transactionReceipt = await transaction.wait();
      console.log(transactionReceipt);
    }
  };

  const fetchMyRequests = async () => {
    if (currentAccount) {
      const query = `
		query MyQuery {
			interestDatas(where: {userAddress: "${currentAccount}"}) {
			  blockNumber
			  blockTimestamp
			  eventId
			  id
			  status
			  transactionHash
			  userAddress
			}
		  }`;
      const client = new ApolloClient({
        uri: APIURL,
        cache: new InMemoryCache(),
      });

      const res = await client.query({ query: gql(query) });
      let eventsList = {};
      const resData = res.data.interestDatas;

      resData.forEach((item) => {
        if (
          !eventsList[`${item.eventId},${item.userAddress}`] ||
          parseInt(item.blockTimestamp) >
            parseInt(
              eventsList[`${item.eventId},${item.userAddress}`].blockTimestamp
            )
        ) {
          eventsList[`${item.eventId},${item.userAddress}`] = item;
        }
      });

      const newEventList = Object.values(eventsList);
      console.log(newEventList);

      let result = [];

      for (let i = 0; i < newEventList.length; i++) {
        const eventData = await getEvent(newEventList[i].eventId);
        result.push({
          status: newEventList[i].status,
          ...eventData,
        });
      }

      console.log(result);

      return result;
    }
    return [];
  };

  const getEvent = async (eventId) => {
    const query = `query MyQuery {
		eventEvents(
		  orderBy: blockTimestamp
		  orderDirection: desc
		  first: 1
		  where: {eventId: "${eventId}"}
		) {
		  blockNumber
		  blockTimestamp
		  creator
		  destination
		  date
		  eventId
		  id
		  name
		  nftsGiven
		  transactionHash
		}
	  }`;

    const client = new ApolloClient({
      uri: APIURL,
      cache: new InMemoryCache(),
    });

    const res = await client.query({ query: gql(query) });
    return res.data.eventEvents[0];
  };

  const fetchEventRequests = async (eventId) => {
    // const contract = await connectingWithSmartContract();
    if (currentAccount) {
      const query = `
		query MyQuery {
			interestDatas(where: {eventId: "${eventId}"}) {
			  blockNumber
			  blockTimestamp
			  eventId
			  id
			  status
			  transactionHash
			  userAddress
			}
		  }`;
      const client = new ApolloClient({
        uri: APIURL,
        cache: new InMemoryCache(),
      });

      const res = await client.query({ query: gql(query) });
      const eventsList = {};
      const resData = res.data.interestDatas;

      console.log("resdata", resData);

      resData.forEach((item) => {
        if (
          !eventsList[`${item.eventId},${item.userAddress}`] ||
          parseInt(item.blockTimestamp) >
            parseInt(
              eventsList[`${item.eventId},${item.userAddress}`].blockTimestamp
            )
        ) {
          eventsList[`${item.eventId},${item.userAddress}`] = item;
        }
      });

      const newEventList = Object.values(eventsList);
      console.log(newEventList);

      let result = [];

      for (let i = 0; i < newEventList.length; i++) {
        const userData = await fetchUserByAddress(newEventList[i].userAddress);
        result.push({
          status: newEventList[i].status,
          ...userData,
        });
      }

      return result;
    }
    return [];
  };

  const acceptUser = async (eventId, userId) => {
    const contract = await connectingWithSmartContract();
    if (currentAccount) {
      const transaction = await contract.approveInterest(eventId, userId);
      const transactionReceipt = await transaction.wait();
      console.log(transactionReceipt);
    }
  };

  const rejectUser = async (eventId, userId) => {
    const contract = await connectingWithSmartContract();
    if (currentAccount) {
      const transaction = await contract.rejectInterest(eventId, userId);
      const transactionReceipt = await transaction.wait();
      console.log(transactionReceipt);
    }
  };

  const fetchUserNFTs = async (userAddress) => {
    console.log(userAddress);
    const query = `
	query MyQuery {
		poapEvents(where: {owner: "${userAddress}"}) {
		  blockTimestamp
		  cid
		  eventId
		  eventName
		  id
		  itemId
		  owner
		  transactionHash
		}
	  }`;
    const client = new ApolloClient({
      uri: APIURL,
      cache: new InMemoryCache(),
    });

    const res = await client.query({ query: gql(query) });
    console.log("res", res);

    return res.data.poapEvents;
  };

  return (
    <TripCompanionContext.Provider
      value={{
        connectingWithSmartContract,
        registerUser,
        createEvent,
        fetchAllEvents,
        fetchMyEvents,
        joinEvent,
        fetchMyRequests,
        getEvent,
        fetchEventRequests,
        acceptUser,
        rejectUser,
        fetchUserByAddress,
        verifyUser,
        giveNFTsToApprovedUsers,
        fetchUserNFTs,
      }}
    >
      {children}
    </TripCompanionContext.Provider>
  );
};
