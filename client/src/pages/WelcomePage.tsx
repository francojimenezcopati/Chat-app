import { useState } from "react";
import "./test.css"


const WelcomePage = () => {
    const [username, setUsername] = useState("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(username); // Datos del formulario
    };

    return (
        <div className="relative h-screen w-screen flex items-center justify-center">
            {/* Capa de fondo con degradado y máscara */}
            <div className="absolute inset-0 gradient-mask bg-gradient-to-b from-[#15171f] via-[#14161C] to-[#0F1115] z-0"></div>

            <div className="z-10 flex-1 flex justify-center items-center mt-4 ">
                <div className="w-full max-w-md p-8 md:-translate-x-24  flex flex-col items-start gap-4">
                    <h1 className="text-5xl font-semibold text-gray-100 text-center">
                        Welcome 👋
                    </h1>
                    <h2 className='text-lg text-gray-300 my-4 text-center'>
                        Set a username to get started
                    </h2>
                    <form className="flex flex-col gap-2 w-full" method="post" >
                        <div className="flex flex-col items-start justify-between gap-1 rounded-lg shadow-lg bg-slate-700 p-4">

                            <label className="-mt-2 text-gray-400 w-full" htmlFor="username">Username</label>
                            <input id="username" name="username" onChange={handleInputChange} className="text-gray-100 text-lg focus:outline-none autofill:shadow-inner autofill:bg-slate-600" type="text" />
                        </div>
                        <button onClick={handleSubmit} className="p-3 rounded-lg bg-amber-600 text-gray-100 hover:cursor-pointer hover:bg-amber-700" >Send</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default WelcomePage;
