// import { BrowserRouter, Route, Routes } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage";
import { Toaster } from "sonner";
import Footer from "./components/Footer";
import ChatPage from "./pages/ChatPage";
import { useUsernameContext } from "./context/useUsernameContext";
// import NavBar from "./components/NavBar"

function App() {
	const { username } = useUsernameContext();

	return (
		<>
			<Toaster position="bottom-left" richColors />
			<div className=" h-screen w-screen">
				{username == "" ? <WelcomePage /> : <ChatPage username={username} />}
			</div>
			<Footer />
		</>
	);
}

export default App;
