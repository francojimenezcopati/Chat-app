import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { UsernameProvider } from "./context/UsernameContext.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<UsernameProvider>
			<App />
		</UsernameProvider>
	</StrictMode>,
);
