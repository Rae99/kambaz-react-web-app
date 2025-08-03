import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { setCurrentUser } from './reducer';
import { useDispatch } from 'react-redux';
import { FormControl, Button } from 'react-bootstrap';
import * as client from './client';

export default function Signin() {
  const [credentials, setCredentials] = useState<any>({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const signin = async () => {
    const user = await client.signin(credentials);
    if (!user) return;
    dispatch(setCurrentUser(user));
    navigate('/Kambaz/Dashboard');
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <h2 className="mb-4">Signin</h2>
      <FormControl
        defaultValue={credentials.username}
        onChange={(e) =>
          setCredentials({ ...credentials, username: e.target.value })
        }
        className="mb-2"
        placeholder="username"
        id="wd-username"
      />
      <FormControl
        defaultValue={credentials.password}
        onChange={(e) =>
          setCredentials({ ...credentials, password: e.target.value })
        }
        className="mb-2"
        placeholder="password"
        type="password"
        id="wd-password"
      />
      <Button onClick={signin} id="wd-signin-btn" className="w-100">
        {' '}
        Sign in{' '}
      </Button>

      <Link to="/Kambaz/Account/Signup" className="text-primary">
        Signup
      </Link>
    </div>
  );
}
