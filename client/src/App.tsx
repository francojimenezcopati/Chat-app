import { BrowserRouter, Route, Routes } from "react-router-dom"
import WelcomePage from "./pages/WelcomePage"
import { Toaster } from "sonner"
import Footer from "./components/Footer"
// import NavBar from "./components/NavBar"

function App() {

    return (
        <BrowserRouter>
            <Toaster richColors />
            <div className=''>
                <div className='container max-w-[100%] '>
                    <Routes>
                        <Route path="/" element={<WelcomePage />} />
                    </Routes>
                </div>
            </div>
            <Footer />
        </BrowserRouter>
    )
}

export default App
