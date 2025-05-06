import './App.css';
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import SignupForm from './pages/Signup.jsx';
import MentorApplicationform from './pages/MentorApplicationform';
import MentorApplicationdone from './pages/MentorApplicationdone';
import MenteeHome from './pages/MenteeHome';
import ForgotPassword from './pages/ForgotPassword';
import BrowseMentors from './pages/BrowseMentors';
import Header from "./components/comp/Header";
import Footer from "./components/comp/Footer";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
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
import ProtectedRoute from "./components/comp/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import MenteeProfile from "./pages/MenteeProfile";
import MentorSignup from './components/comp/MentorSignup';
import CalendlyIntegration from './components/CalendlyIntegration';

function App() {
  const location = useLocation();
  const { user } = useAuth();

  // Hide header on login, signup, and application pages
  const hideHeader =
    location.pathname === "/login" ||
    location.pathname === "/signup/mentee" ||
    location.pathname === "/signup/mentor" ||
    location.pathname === "/signup/mentor/form" ||
    location.pathname === "/mentor/done";

  // Redirect authenticated users from login/signup pages to their respective dashboards
  if (user && (location.pathname === "/login" || location.pathname.startsWith("/signup"))) {
    // Allow mentor signup for non-mentor users
    if (location.pathname.startsWith("/signup/mentor")) {
      if (user.role === "mentor") {
        return <Navigate to="/my-profile" />;
      }
      return null; // Don't redirect, allow access
    }
    return <Navigate to={user.role === "mentee" ? "/" : "/my-profile"} />;
  }

  return (
    <>
      <ScrollToTop />
      {!hideHeader && <Header />}
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup/:role" element={<SignupForm />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/mentor-guidelines" element={<MentorGuidelines />} />
        <Route path="/mentee/guidelines" element={<MenteeGuidelines />} />
        <Route path="/integrate-calendly" element={<CalendlyIntegration />} />

        {/* Protected routes that require authentication */}
        <Route 
          path="/home/mentee" 
          element={
            <ProtectedRoute requiredRole="mentee">
              <MenteeHome />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/my-profile" 
          element={
            <ProtectedRoute requiredRole="mentor">
              <RedirectToProfile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/mentee/profile" 
          element={
            <ProtectedRoute requiredRole="mentee">
              <MenteeProfile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={null} 
        />
        <Route 
          path="/settings/privacy" 
          element={null} 
        />
        <Route 
          path="/feedback" 
          element={
            <ProtectedRoute>
              
              <Feedback />
            </ProtectedRoute>
          } 
        />

        {/* Mentor application routes */}
        <Route path="/signup/mentor/form" element={<MentorApplicationform />} />
        <Route path="/mentor/done" element={<MentorApplicationdone />} />

        {/* Browse routes with optional authentication */}
        <Route path="/mentorsignup" element={<MentorSignup />} />
        <Route path="/mentors/:mentorId" element={<MentorProfile />} />
        <Route path="/browse/:category" element={<BrowseMentors />} />
        <Route path="/browse/search" element={<BrowseMentors />} />
      </Routes>
      <Footer />
      <GoToTopButton />
    </>
  );
}

export default App;
