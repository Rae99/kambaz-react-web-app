import { AiOutlineDashboard } from 'react-icons/ai';
import { IoCalendarOutline } from 'react-icons/io5';
import { LiaBookSolid, LiaCogSolid } from 'react-icons/lia';
import { FaInbox, FaRegCircleUser } from 'react-icons/fa6';
import { Link, useLocation } from 'react-router-dom';
import { ListGroup } from 'react-bootstrap';
export default function KambazNavigation() {
  const { pathname } = useLocation();
  const links = [
    { label: 'Dashboard', path: '/Kambaz/Dashboard', icon: AiOutlineDashboard },
    { label: 'Courses', path: '/Kambaz/Dashboard', icon: LiaBookSolid },
    { label: 'Calendar', path: '/Kambaz/Calendar', icon: IoCalendarOutline },
    { label: 'Inbox', path: '/Kambaz/Inbox', icon: FaInbox },
    { label: 'Labs', path: '/Labs', icon: LiaCogSolid },
  ];
  // We want to do it dynamicallly, so don't put AiOutlineDashboard in a <>
  // link.icon is a function we can pass a parameter into

  return (
    <ListGroup
      id="wd-kambaz-navigation"
      style={{ width: 120 }}
      className="rounded-0 position-fixed bottom-0 top-0 d-none d-md-block bg-black z-2"
    >
      <ListGroup.Item
        id="wd-neu-link"
        target="_blank"
        href="https://www.northeastern.edu/"
        action
        className="bg-black border-0 text-center"
      >
        <img src="/images/NEU.png" width="75px" />
      </ListGroup.Item>
      <ListGroup.Item
        as={Link}
        to="/Kambaz/Account"
        className={`text-center border-0 bg-black
            ${
              pathname.includes('Account')
                ? 'bg-white text-danger'
                : 'bg-black text-white'
            }`}
      >
        <FaRegCircleUser
          className={`fs-1 ${
            pathname.includes('Account') ? 'text-danger' : 'text-white'
          }`}
        />
        <br />
        Account
      </ListGroup.Item>
      {links.map((link) => (
        <ListGroup.Item
          key={link.label} // Use label as key since it's unique
          as={Link}
          to={link.path}
          className={`bg-black text-center border-0
              ${
                pathname.includes(link.label)
                  ? 'text-danger bg-white'
                  : 'text-white bg-black'
              }`}
        >
          {link.icon({ className: 'fs-1 text-danger' })}
          <br />
          {link.label}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}

// Q1
// as={Link} is a way to tell React Router to render the ListGroup.Item as a Link component, which allows for client-side navigation without a full page reload.
// 🧠 What’s going on here?
// 	•	ListGroup.Item is a component from React-Bootstrap. By default, it renders as a <div> or <a>.
// 	•	The as={Link} part means:
// 👉 “Instead of rendering as a <div> or <a>, render this component using the <Link> component from react-router-dom.”
// 	•	to="/Labs" is a prop that is expected by Link, not ListGroup.Item.

// So why is Link not a “property”?

// Because Link is a React component, not a string or a prop.

// Q2
//📌 What it means:
// •	as={Link}: Renders this ListGroup.Item as a <Link> (from react-router-dom), so clicking it navigates the user.
// •	to="/Kambaz/Account": When clicked, the browser navigates to this route.
// •	pathname.includes("Account"): Reactively checks if the current path (e.g. /Kambaz/Account) includes "Account".
// •	If true ➜ it applies the "bg-white text-danger" class.
// •	Otherwise ➜ it applies the "bg-black text-white" class.
