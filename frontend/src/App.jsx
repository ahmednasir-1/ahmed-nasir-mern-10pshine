import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import TextEditor from "./components/TextEditor";


export default function App() {
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/editor" element={<TextEditor />} />
            </Routes>
        </BrowserRouter>
      
    )
}