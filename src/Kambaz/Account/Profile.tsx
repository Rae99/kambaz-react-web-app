import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentUser } from './reducer';
import { FormControl, Button } from 'react-bootstrap';
import * as client from './client';

export default function Profile() {
  const [profile, setProfile] = useState<any>({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const updateProfile = async () => {
    try {
      const updatedProfile = await client.updateUser(profile);
      dispatch(setCurrentUser(updatedProfile));
      setProfile(updatedProfile); // Update local profile state to reflect the changes
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const fetchProfile = () => {
    if (!currentUser) return navigate('/Kambaz/Account/Signin');
    setProfile(currentUser);
  };
  const signout = async () => {
    await client.signout();
    dispatch(setCurrentUser(null));
    navigate('/Kambaz/Account/Signin');
  };
  useEffect(() => {
    fetchProfile();
  }, []);

  // Update local profile state when currentUser changes from Redux
  useEffect(() => {
    if (currentUser) {
      setProfile(currentUser);
    }
  }, [currentUser]);
  // This effect does not depend on any variable. Only run it after mounting.
  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <h2>Profile</h2>
      {profile && (
        <div>
          <FormControl
            defaultValue={profile.username}
            id="wd-username"
            className="mb-2"
            placeholder="Enter username"
            onChange={(e) =>
              setProfile({ ...profile, username: e.target.value })
            }
          />
          <FormControl
            defaultValue={profile.password}
            id="wd-password"
            className="mb-2"
            placeholder="Enter password"
            onChange={(e) =>
              setProfile({ ...profile, password: e.target.value })
            }
          />
          <FormControl
            defaultValue={profile.firstName}
            id="wd-firstname"
            className="mb-2"
            placeholder="Enter first name"
            onChange={(e) =>
              setProfile({ ...profile, firstName: e.target.value })
            }
          />
          <FormControl
            defaultValue={profile.lastName}
            id="wd-lastname"
            className="mb-2"
            placeholder="Enter last name"
            onChange={(e) =>
              setProfile({ ...profile, lastName: e.target.value })
            }
          />
          <FormControl
            defaultValue={profile.dob ? profile.dob.split('T')[0] : ''}
            id="wd-dob"
            className="mb-2"
            placeholder="Select date of birth"
            onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
            type="date"
          />
          <FormControl
            defaultValue={profile.email}
            id="wd-email"
            className="mb-2"
            placeholder="Enter email address"
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          />
          <select
            onChange={(e) => setProfile({ ...profile, role: e.target.value })}
            className="form-control mb-2"
            id="wd-role"
            value={profile.role}
          >
            <option value="USER">User</option>{' '}
            <option value="ADMIN">Admin</option>
            <option value="FACULTY">Faculty</option>{' '}
            <option value="STUDENT">Student</option>
          </select>
          <button
            onClick={updateProfile}
            className="btn btn-primary w-100 mb-2"
          >
            {' '}
            Update{' '}
          </button>
          <Button onClick={signout} className="w-100 mb-2" id="wd-signout-btn">
            Sign out
          </Button>
        </div>
      )}
    </div>
  );
}
