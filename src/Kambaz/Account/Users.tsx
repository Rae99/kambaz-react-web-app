import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import PeopleTable from '../Courses/People/Table';
import * as client from './client';

export default function Users() {
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
  return (
    <div>
      <h3>Users</h3>
      <PeopleTable users={users} />
    </div>
  );
}
