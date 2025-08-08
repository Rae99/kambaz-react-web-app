import { useEffect, useState } from 'react';
import { FaCheck, FaUserCircle } from 'react-icons/fa';
import { IoCloseSharp } from 'react-icons/io5';
import { useParams, useNavigate } from 'react-router';
import * as client from '../../Account/client';
import { FormControl } from 'react-bootstrap';
import { FaPencil } from 'react-icons/fa6';
export default function PeopleDetails() {
  const { uid } = useParams();
  const [user, setUser] = useState<any>({});
  const [editedUser, setEditedUser] = useState<any>({});
  const [editing, setEditing] = useState(false);

  const navigate = useNavigate();

  const saveUser = async () => {
    await client.updateUser(editedUser);
    setUser(editedUser);
    setEditing(false);
  };

  const startEditing = () => {
    setEditedUser({ ...user });
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditedUser({});
    setEditing(false);
  };
  const deleteUser = async (uid: string) => {
    await client.deleteUser(uid);
    navigate(-1);
  };

  const fetchUser = async () => {
    if (!uid) return;
    const user = await client.findUserById(uid);
    setUser(user);
  };
  useEffect(() => {
    if (uid) fetchUser();
  }, [uid]);
  if (!uid) return null;

  return (
    <div className="wd-people-details position-fixed top-0 end-0 bottom-0 bg-white p-4 shadow w-25">
      <button
        onClick={() => navigate(-1)} //go back to the previous page
        className="btn position-fixed end-0 top-0 wd-close-details"
      >
        <IoCloseSharp className="fs-1" />{' '}
      </button>
      <div className="text-center mt-2">
        {' '}
        <FaUserCircle className="text-secondary me-2 fs-1" />{' '}
      </div>
      <hr />
      <div className="text-danger fs-4">
        {!editing && (
          <FaPencil
            onClick={startEditing}
            className="float-end fs-5 mt-2 wd-edit"
          />
        )}
        {editing && (
          <FaCheck
            onClick={saveUser}
            className="float-end fs-5 mt-2 me-2 wd-save"
          />
        )}

        {/* Name Field */}
        {!editing && (
          <div className="wd-name" onClick={startEditing}>
            {user.firstName} {user.lastName}
          </div>
        )}
        {editing && (
          <div className="mb-2">
            <FormControl
              className="mb-1 wd-edit-firstname"
              placeholder="First Name"
              value={editedUser.firstName || ''}
              onChange={(e) =>
                setEditedUser({ ...editedUser, firstName: e.target.value })
              }
            />
            <FormControl
              className="wd-edit-lastname"
              placeholder="Last Name"
              value={editedUser.lastName || ''}
              onChange={(e) =>
                setEditedUser({ ...editedUser, lastName: e.target.value })
              }
            />
          </div>
        )}
      </div>
      {/* Role Field */}
      <b>Role:</b> {!editing && <span className="wd-roles">{user.role}</span>}
      {editing && (
        <select
          className="form-select mb-2 wd-edit-role"
          value={editedUser.role || ''}
          onChange={(e) =>
            setEditedUser({ ...editedUser, role: e.target.value })
          }
        >
          <option value="STUDENT">Student</option>
          <option value="TA">TA</option>
          <option value="FACULTY">Faculty</option>
          <option value="ADMIN">Admin</option>
          <option value="USER">User</option>
        </select>
      )}
      <br />
      {/* Email Field */}
      <b>Email:</b> {!editing && <span className="wd-email">{user.email}</span>}
      {editing && (
        <FormControl
          className="mb-2 wd-edit-email"
          placeholder="Email address"
          type="email"
          value={editedUser.email || ''}
          onChange={(e) =>
            setEditedUser({ ...editedUser, email: e.target.value })
          }
        />
      )}
      <br />
      {/* Username Field */}
      <b>Username:</b>{' '}
      {!editing && <span className="wd-username">{user.username}</span>}
      {editing && (
        <FormControl
          className="mb-2 wd-edit-username"
          placeholder="Username"
          value={editedUser.username || ''}
          onChange={(e) =>
            setEditedUser({ ...editedUser, username: e.target.value })
          }
        />
      )}
      <br />
      {/* Password Field */}
      <b>Password:</b>{' '}
      {!editing && <span className="wd-password">••••••••</span>}
      {editing && (
        <FormControl
          className="mb-2 wd-edit-password"
          placeholder="Password"
          type="password"
          value={editedUser.password || ''}
          onChange={(e) =>
            setEditedUser({ ...editedUser, password: e.target.value })
          }
        />
      )}
      <br />
      {/* Login ID Field */}
      <b>Login ID:</b>{' '}
      {!editing && <span className="wd-login-id">{user.loginId}</span>}
      {editing && (
        <FormControl
          className="mb-2 wd-edit-loginid"
          placeholder="Login ID"
          value={editedUser.loginId || ''}
          onChange={(e) =>
            setEditedUser({ ...editedUser, loginId: e.target.value })
          }
        />
      )}
      <br />
      {/* Section Field */}
      <b>Section:</b>{' '}
      {!editing && <span className="wd-section">{user.section}</span>}
      {editing && (
        <FormControl
          className="mb-2 wd-edit-section"
          placeholder="Section"
          value={editedUser.section || ''}
          onChange={(e) =>
            setEditedUser({ ...editedUser, section: e.target.value })
          }
        />
      )}
      <br />
      {/* Total Activity Field */}
      <b>Total Activity:</b>{' '}
      {!editing && (
        <span className="wd-total-activity">{user.totalActivity}</span>
      )}
      {editing && (
        <FormControl
          className="mb-2 wd-edit-totalactivity"
          placeholder="Total Activity"
          value={editedUser.totalActivity || ''}
          onChange={(e) =>
            setEditedUser({ ...editedUser, totalActivity: e.target.value })
          }
        />
      )}
      <hr />
      <button
        onClick={() => deleteUser(uid)}
        className="btn btn-danger float-end wd-delete"
      >
        {' '}
        Delete{' '}
      </button>
      <button
        onClick={editing ? cancelEditing : () => navigate(-1)}
        className="btn btn-secondary float-start me-2 wd-cancel"
      >
        {editing ? 'Cancel' : 'Close'}
      </button>
    </div>
  );
}
