import './App.css'
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import SignupForm from './pages/Signup.jsx';
import MentorProfile from "./pages/MentorProfile";
import Header from "./components/comp/Header";
import { Routes, Route } from "react-router-dom";
function App() {

  return (
    <>
      <Header/>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup/:role" element={<SignupForm />} />
      <Route path="/mentors/:mentorId" element={<MentorProfile />} />
    </Routes>
    </>
  )
}

export default App

