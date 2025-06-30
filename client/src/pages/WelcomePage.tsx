import { useSpinner } from "@/context/useSpinner";
import { createUser } from "../api/use.api";
import { useUsernameContext } from "../context/useUsernameContext";
import "./test.css";

const WelcomePage = () => {
	const { setUsername } = useUsernameContext();
	const { showSpinner } = useSpinner();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const username = (document.getElementById("username") as HTMLInputElement).value;

		showSpinner(true);
		const success = await createUser({ username });
		showSpinner(false);
		if (success) {
			setUsername(username.toLowerCase());
		}
	};

	return (
		<div className="relative h-screen w-screen flex items-center justify-center">
			{/* Capa de fondo con degradado y máscara */}
			<div className="absolute inset-0 gradient-mask bg-gradient-to-b from-[#15171f] via-[#14161C] to-[#0F1115] z-0"></div>

			<img className="absolute w-screen h-screen -z-10" src="valley.jpg" />

			<div className="z-10 flex-1 flex justify-center items-center mt-4 ">
				<div className="w-full max-w-md p-8 md:-translate-x-32  flex flex-col items-start gap-4">
					<h1 className="text-5xl font-semibold text-gray-100 text-center">Welcome 👋</h1>
					<h2 className="text-lg text-gray-300 my-4 text-center">
						Set a username to get started
					</h2>
					<form className="flex flex-col gap-2 w-full" method="post">
						<div className="flex flex-col items-start justify-between gap-1 rounded-lg shadow-lg bg-slate-700 p-4">
							<label className="-mt-2 text-gray-400 w-full" htmlFor="username">
								Username
							</label>
							<input
								maxLength={20}
								id="username"
								name="username"
								className="text-gray-100 text-lg focus:outline-none autofill:shadow-inner autofill:bg-slate-600"
								type="text"
							/>
						</div>
						<button
							onClick={handleSubmit}
							className="p-3 rounded-lg bg-amber-600 text-gray-100 hover:cursor-pointer hover:bg-amber-700"
						>
							Send
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default WelcomePage;
