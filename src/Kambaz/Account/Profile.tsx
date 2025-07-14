import { Link } from "react-router";

export default function Profile() {
  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <h2>Profile</h2>
      <div className="form-group mb-3">
        <input className="form-control" value="alice" />
      </div>
      <div className="form-group mb-3">
        <input className="form-control" value="123" />
      </div>
      <div className="form-group mb-3">
        <input className="form-control" value="Alice" />
      </div>
      <div className="form-group mb-3">
        <input className="form-control" value="Wonderland" />
      </div>
      <div className="form-group mb-3">
        <input type="date" className="form-control" value="2000-01-01" />
      </div>
      <div className="form-group mb-3">
        <input className="form-control" value="alice@wonderland.com" />
      </div>
      <div className="form-group mb-3">
        <input className="form-control" value="User" />
      </div>
      <div className="d-grid">
        <Link to="/Kambaz/Account/Signin">
          <button className="btn btn-danger">Signout</button>
        </Link>
      </div>
    </div>
  );
}
