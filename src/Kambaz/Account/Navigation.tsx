import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
export default function AccountNavigation() {
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const links = currentUser ? ["Profile"] : ["Signin", "Signup"];
  const { pathname } = useLocation();

  return (
    <nav className="ms-4 mt-2">
      {links.map((link) => (
        <div key={link}>
          <Link
            to={`/Kambaz/Account/${link}`}
            id={`wd-account-${link.toLowerCase()}-link`}
            className={
              pathname.includes(link)
                ? "text-decoration-none text-dark d-block border-start border-3 border-dark ps-2"
                : "text-danger d-block ps-2"
            }
          >
            {link}
          </Link>
        </div>
      ))}
    </nav>
  );
}
