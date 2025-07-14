import { Link } from "react-router-dom";

export default function Signup() {
  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <h2>Signup</h2>
      <div className="form-group mb-3">
        <input type="text" placeholder="username" className="form-control" />
      </div>
      <div className="form-group mb-3">
        <input
          type="password"
          placeholder="password"
          className="form-control"
        />
      </div>
      <div className="d-grid">
        <Link to="/Kambaz/Account/Profile">
          <button className="btn btn-primary">Signup</button>
        </Link>
      </div>
      <div className="mt-2">
        <Link to="/Kambaz/Account/Signin">Signin</Link>
      </div>
    </div>
  );
}
