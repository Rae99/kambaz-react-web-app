import { Link } from "react-router-dom";
export default function AccountNavigation() {
  return (
    <div id="wd-account-navigation">
      <ul>
        <li>
          <Link to="/Kambaz/Account/Signin">Sign in</Link>
        </li>
        <li>
          <Link to="/Kambaz/Account/Signup">Sign up</Link>
        </li>
        <li>
          <Link to="/Kambaz/Account/Profile">Profile</Link>
        </li>
      </ul>
    </div>
  );
}
