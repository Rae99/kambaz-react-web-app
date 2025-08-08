import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import PeopleTable from '../Courses/People/Table';
import * as client from './client';
import { FormControl } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';

export default function Users() {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const { uid } = useParams();
  const fetchUsers = async () => {
    try {
      const users = await client.findAllUsers();
      setUsers(users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, [uid]);

  const createUser = async () => {
    const user = await client.createUser({
      firstName: 'New',
      lastName: `User${users.length + 1}`,
      username: `newuser${Date.now()}`,
      password: 'password123',
      email: `email${users.length + 1}@neu.edu`,
      section: 'S101',
      role: 'STUDENT',
    });
    setUsers([...users, user]);
  };

  const filterUsers = async (nameFilter: string, roleFilter: string) => {
    if (nameFilter && roleFilter) {
      // Both filters active - use combined filtering
      const users = await client.findUsersByNameAndRole(nameFilter, roleFilter);
      setUsers(users);
    } else if (nameFilter) {
      // Only name filter active
      const users = await client.findUsersByPartialName(nameFilter);
      setUsers(users);
    } else if (roleFilter) {
      // Only role filter active
      const users = await client.findUsersByRole(roleFilter);
      setUsers(users);
    } else {
      // No filters - show all users
      fetchUsers();
    }
  };

  const handleNameChange = (newName: string) => {
    setName(newName);
    filterUsers(newName, role);
  };

  const handleRoleChange = (newRole: string) => {
    setRole(newRole);
    filterUsers(name, newRole);
  };

  const clearFilters = () => {
    setName('');
    setRole('');
    fetchUsers();
  };

  return (
    <div>
      <h3>Users</h3>
      <FormControl
        value={name}
        onChange={(e) => handleNameChange(e.target.value)}
        placeholder="Search people"
        className="float-start w-25 me-2 wd-filter-by-name"
      />
      <select
        value={role}
        onChange={(e) => handleRoleChange(e.target.value)}
        className="form-select float-start w-25 wd-select-role"
      >
        <option value="">All Roles</option>
        <option value="STUDENT">Students</option>
        <option value="TA">Assistants</option>
        <option value="FACULTY">Faculty</option>
        <option value="ADMIN">Administrators</option>
        <option value="USER">Users</option>
      </select>
      <button
        onClick={clearFilters}
        className="btn btn-secondary ms-2"
        disabled={!name && !role}
      >
        Clear Filters
      </button>
      <button
        onClick={createUser}
        className="float-end btn btn-danger wd-add-people"
      >
        <FaPlus className="me-2" />
        Users
      </button>
      <PeopleTable users={users} />
    </div>
  );
}
