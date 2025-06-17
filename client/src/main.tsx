import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { UsernameProvider } from "./context/UsernameContext.tsx";
import { ChatProvider } from "./context/ChatContext.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ChatProvider>
			<UsernameProvider>
				<App />
			</UsernameProvider>
		</ChatProvider>
	</StrictMode>,
);
