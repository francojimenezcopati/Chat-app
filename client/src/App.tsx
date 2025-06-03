import { BrowserRouter, Route, Routes } from "react-router-dom"
import WelcomePage from "./pages/WelcomePage"
import { Toaster } from "sonner"
import Footer from "./components/Footer"
// import NavBar from "./components/NavBar"

function App() {
  return (
    <BrowserRouter>
      <Toaster richColors />
      <div className='flex justify-center items-center w-full h-full pb-10'>
        <div className='container max-w-[600px] '>
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
