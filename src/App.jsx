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
import Settings from "./pages/Settings";
import MenteeProfile from "./pages/MenteeProfile";

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
    return <Navigate to={user.role === "mentee" ? "/home/mentee" : "/my-profile"} />;
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
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings/privacy" 
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/feedback" 
          element={
            <ProtectedRoute>
              <Feedback />
            </ProtectedRoute>
          } 
        />

        {/* Semi-protected routes (accessible by authenticated users with specific conditions) */}
        <Route 
          path="/signup/mentor/form" 
          element={
            user ? <MentorApplicationform /> : <Navigate to="/signup/mentor" />
          } 
        />
        <Route 
          path="/mentor/done" 
          element={
            user ? <MentorApplicationdone /> : <Navigate to="/signup/mentor" />
          } 
        />

        {/* Browse routes with optional authentication */}
        <Route path="/mentors/static/:mentorId" element={<MentorProfile />} />
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
