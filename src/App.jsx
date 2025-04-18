import './App.css';
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import SignupForm from './pages/Signup.jsx';
import MentorProfile from "./pages/MentorProfile";
import MentorApplicationform from './pages/MentorApplicationform';
import MentorApplicationdone from './pages/MentorApplicationdone';
import MenteeHome from './pages/MenteeHome';
import Header from "./components/comp/Header";
import Footer from "./components/comp/Footer";
import { Routes, Route, useLocation } from "react-router-dom";
// import ForgotPassword from './pages/Forgotpassword';

function App() {
  const location = useLocation(); // Gives the current route

  // Hide header only for login and sign up as mentee
  const hideHeader = location.pathname === "/login" || location.pathname === "/signup/mentee";

  return (
    <>
      {!hideHeader && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup/:role" element={<SignupForm />} />
        <Route path="/mentors/:mentorId" element={<MentorProfile />} />
        <Route path="/signup/mentor/form" element={<MentorApplicationform />} />
        <Route path="/mentor/done" element={<MentorApplicationdone />} />
        <Route path="/home/mentee" element={<MenteeHome />} />
        {/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}
      </Routes>
      <Footer />
    </>
  );
}

export default App;
