import './App.css';
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import SignupForm from './pages/Signup.jsx';
import MentorProfile from "./pages/MentorProfile";
import MentorApplicationform from './pages/MentorApplicationform';
import MentorApplicationdone from './pages/MentorApplicationdone';
import MenteeHome from './pages/MenteeHome';
import ForgotPassword from './pages/ForgotPassword';
import BrowseMentors from './pages/BrowseMentors';
import Header from "./components/comp/Header";
import Footer from "./components/comp/Footer";
import { Routes, Route, useLocation } from "react-router-dom";
import AboutUs from "./pages/AboutUs";
import ScrollToTop from "./components/comp/ScrollToTop";
import GoToTopButton from "./components/comp/GoToTopButton";
import HelpCenter from "./pages/HelpCenter";
import Feedback from "./pages/Feedback";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import ContactUs from "./pages/ContactUs";
import MentorGuidelines from "./pages/MentorGuidelines";
import MenteeGuidelines from "./pages/MenteeGuidelines";
import RedirectToProfile from "./pages/RedirectToProfile";

function App() {
  const location = useLocation(); // Gives the current route

  // Hide header on login, signup as mentee, and mentee home page
  const hideHeader =
    location.pathname === "/login" ||
    location.pathname === "/signup/mentee" ||
    location.pathname === "/home/mentee" ||
    location.pathname === "/mentor/done";

  return (
    <>
      <ScrollToTop />
      {!hideHeader && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup/:role" element={<SignupForm />} />
        <Route path="/mentors/:mentorId" element={<MentorProfile />} />
        <Route path="/signup/mentor/form" element={<MentorApplicationform />} />
        <Route path="/mentor/done" element={<MentorApplicationdone />} />
        <Route path="/home/mentee" element={<MenteeHome />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/browse/:category" element={<BrowseMentors />} />
        <Route path="/browse/search" element={<BrowseMentors />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/mentor-guidelines" element={<MentorGuidelines />} />
        <Route path="/mentee/guidelines" element={<MenteeGuidelines />} />
        <Route path="/my-profile" element={<RedirectToProfile />} />
      </Routes>
      <Footer />
      <GoToTopButton />
    </>
  );
  
}

export default App;
