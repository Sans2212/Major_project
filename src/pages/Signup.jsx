import { useParams, useNavigate } from "react-router-dom";
import MenteeSignup from "../components/comp/MenteeSignup";
import MentorSignup from "../components/comp/MentorSignup";
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

  if (role === "mentee") {
    return <MenteeSignup />;
  } else if (role === "mentor") {
    return <MentorSignup />;
  } else {
    return <p>Invalid signup role!</p>;
  }
}

export default Signup;
