import './App.css'
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import SignupForm from './pages/Signup.jsx';
import { Routes, Route } from "react-router-dom";
function App() {

  return (
    <>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup/:role" element={<SignupForm />} />
    </Routes>
    </>
  )
}

export default App

