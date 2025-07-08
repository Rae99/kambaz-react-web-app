import Signin from "./Signin";
import Signup from "./Signup";
import Profile from "./Profile";
import { Routes, Route, Navigate } from "react-router-dom";

export default function Account() {
  return (
    <div id="wd-account-screen">
      <Routes>
        <Route path="/" element={<Navigate to="/Kambaz/Account/Signin" />} />
        <Route path="/Signin" element={<Signin />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Profile" element={<Profile />} />
      </Routes>
    </div>
  );
}
