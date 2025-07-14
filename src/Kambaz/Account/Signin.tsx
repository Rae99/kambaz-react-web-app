import { Link } from "react-router-dom";

export default function Signin() {
  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2 className="mb-4">Signin</h2>
      <input className="form-control mb-3" placeholder="username" />
      <input
        className="form-control mb-3"
        placeholder="password"
        type="password"
      />
      <Link to="/Kambaz/Courses/Home">
        <button className="btn btn-primary w-100 mb-2 ">Signin</button>
      </Link>
      <Link to="/Kambaz/Account/Signup" className="text-primary">
        Signup
      </Link>
    </div>
  );
}
