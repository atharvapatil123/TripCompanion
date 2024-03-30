import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Register from "./pages/Register/Register";
import AddEvent from "./pages/AddEvent/AddEvent";
import UserFeed from "./pages/Feed/Feed";
import Dashboard from "./pages/Dashboard/Dashboard";
import Event from "./pages/Event/Event";
import Home from "./pages/Home/Home";
import AnonLogin from "./pages/AnonLogin/AnonLogin";
import Profile from "./pages/Profile/Profile";

const App = () => {
	const router = createBrowserRouter([
		{
			path: "/",
			element: (
				<>
					<Home />
				</>
			),
		},
		{
			path: "/profile",
			element: (
				<>
					<Profile />
				</>
			),
		},
		{
			path: "/anonVerify",
			element: (
				<>
					<AnonLogin />
				</>
			),
		},
		{
			path: "/register",
			element: (
				<>
					<Register />
				</>
			),
		},
		{
			path: "/addEvent",
			element: (
				<>
					<AddEvent />
				</>
			),
		},
		{
			path: "/feed",
			element: (
				<>
					<UserFeed />
				</>
			),
		},
		{
			path: "/dashboard",
			element: (
				<>
					<Dashboard />
				</>
			),
		},
		{
			path: "/event/:id",
			element: (
				<>
					<Event />
				</>
			),
		}
	]);

  return <RouterProvider router={router}></RouterProvider>;
};

export default App;
