import { useParams, useNavigate } from "react-router-dom";
import MenteeSignup from "../components/comp/MenteeSignup";
import MentorSignup from "../components/comp/MentorSignup";
import Header from "../components/comp/Header";
import { useAuth } from "../context/AuthContext";

function Signup() {
  const { role } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();


  // If user is already logged in and trying to access mentor signup
  if (user && role === "mentor") {
    if (user.role === "mentor") {
      navigate("/my-profile");
      return null;
    }
  }

    return (
      <>
        <Header />
        {role === "mentee" ? (
          <MenteeSignup />
        ) : role === "mentor" ? (
          <MentorSignup />
        ) : (
          <p>Invalid signup role!</p>
        )}
      </>
    );
  }

export default Signup;
