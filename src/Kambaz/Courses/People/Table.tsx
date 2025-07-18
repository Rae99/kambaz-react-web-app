import { FaUserCircle } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { users, enrollments } from "../../Database";
import { Table } from "react-bootstrap";

// when you import { something } from "./Database";
// What TypeScript/Node.js looks for is:
// ./Database/index.ts
//  Yes, the file must be named index.ts (or index.tsx) if you want to import from the folder name alone.

export default function PeopleTable() {
  const { cid } = useParams();

  return (
    <div id="wd-people-table">
      <Table striped>
        <thead>
          <tr>
            <th>Name</th>
            <th>Login ID</th>
            <th>Section</th>
            <th>Role</th>
            <th>Last Activity</th>
            <th>Total Activity</th>
          </tr>
        </thead>
        <tbody>
          {users
            .filter((user) =>
              enrollments.some(
                (enrollment) =>
                  enrollment.user === user._id && enrollment.course === cid
              )
            )
            .map((user) => (
              <tr key={user._id}>
                <td className="wd-full-name text-nowrap">
                  <FaUserCircle className="me-2 fs-1 text-secondary" />
                  <span className="wd-first-name">{user.firstName}</span>{" "}
                  <span className="wd-last-name">{user.lastName}</span>
                </td>
                <td className="wd-login-id">{user.loginId}</td>
                <td className="wd-section">{user.section}</td>
                <td className="wd-role">{user.role}</td>
                <td className="wd-last-activity">{user.lastActivity}</td>
                <td className="wd-total-activity">{user.totalActivity}</td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  );
}

/* You’re wrapping the first and last names inside two <span> tags so that:
	•	You can assign separate class names
	•	Later, you could style them differently (e.g., make first name bold and last name italic)*/
