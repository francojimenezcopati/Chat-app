import { BrowserRouter, Route, Routes } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage";
import { Toaster } from "sonner";
import Footer from "./components/Footer";
import { useState } from "react";
import ChatPage from "./pages/ChatPage";
// import NavBar from "./components/NavBar"

function App() {
	const [username, setUsername] = useState<string | null>(null);

	return (
		<>
			<Toaster richColors />
			<div className=" h-screen w-screen">
				{username == null ? (
					<WelcomePage setUsername={setUsername} />
				) : (
					<ChatPage username={username} />
				)}
			</div>
			<Footer />
		</>
	);
}

export default App;
