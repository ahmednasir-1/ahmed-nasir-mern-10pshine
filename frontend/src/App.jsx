import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./components/SignUp";
import TextEditor from "./components/TextEditor";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import NoteCard from "./components/NoteCard";
import UserProfile from "./pages/UserProfile";
import Trash from "./pages/Trash";


export default function App() {
    return(
        <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/notes/new" element={<TextEditor />} />
                <Route path="/notes/edit/:id" element={<TextEditor />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/trash" element={<Trash />} />
            </Routes>
        </BrowserRouter>
      
    )
}