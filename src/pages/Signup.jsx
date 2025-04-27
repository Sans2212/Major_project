import { useParams } from "react-router-dom";
import MenteeSignup from "../components/comp/MenteeSignup";
import MentorSignup from "../components/comp/MentorSignup";

function Signup() {
  const { role } = useParams();

  if (role === "mentee") {
    return <MenteeSignup />;
  } else if (role === "mentor") {
    return <MentorSignup />;
  } else {
    return <p>Invalid signup role!</p>;
  }
}

export default Signup;
