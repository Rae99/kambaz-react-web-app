import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PeopleTable from './Table';
import * as coursesClient from '../client';

export default function People() {
  const { cid } = useParams();
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsersForCourse = async () => {
      if (cid) {
        try {
          console.log('Fetching users for course:', cid);
          const courseUsers = await coursesClient.findUsersForCourse(cid);
          console.log('Users fetched for course:', courseUsers);
          setUsers(courseUsers || []);
        } catch (error) {
          console.error('Error fetching users for course:', error);
          setUsers([]);
        }
      }
    };

    fetchUsersForCourse();
  }, [cid]);

  return <PeopleTable users={users} />;
}
