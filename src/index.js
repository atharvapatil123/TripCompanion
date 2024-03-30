import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "@biconomy/web3-auth/dist/src/style.css";

import { AuthContextProvider } from "./Context/AuthContext";
import "react-toastify/dist/ReactToastify.css";
import { TripCompanionProvider } from "./Context/TripCompanionContext";
import { AnonAadhaarProvider } from "@anon-aadhaar/react";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<AuthContextProvider>
			<AnonAadhaarProvider>
				<TripCompanionProvider>
					<App />
				</TripCompanionProvider>
			</AnonAadhaarProvider>
		</AuthContextProvider>
	</React.StrictMode>
);
