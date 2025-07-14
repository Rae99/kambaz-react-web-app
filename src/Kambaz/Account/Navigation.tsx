import { Link } from "react-router-dom";
export default function AccountNavigation() {
  return (
    <nav className="ms-4 mt-2">
      <div>
        <div>
          <Link
            to="/Kambaz/Account/Signin"
            className="text-decoration-none text-dark d-block border-start border-3 border-dark ps-2"
          >
            Signin
          </Link>
        </div>
        <div>
          <Link
            to="/Kambaz/Account/Signup"
            className="text-danger d-block ps-2"
          >
            Signup
          </Link>
        </div>
        <div>
          <Link
            to="/Kambaz/Account/Profile"
            className="text-danger d-block ps-2"
          >
            Profile
          </Link>
        </div>
      </div>
    </nav>
  );
}
