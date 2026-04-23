import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";


export default function App() {
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
            </Routes>
        </BrowserRouter>
      
    )
}