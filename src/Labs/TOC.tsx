import Nav from "react-bootstrap/Nav";
import { Link, useLocation } from "react-router-dom";
export default function TOC() {
  const { pathname } = useLocation();
  return (
    <Nav variant="pills" id="wd-toc">
      <Nav.Item>
        <Nav.Link to="/Labs" as={Link}>
          Labs
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link to="/Labs/Lab1" as={Link} active={pathname.includes("Lab1")}>
          Lab 1
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link to="/Labs/Lab2" as={Link} active={pathname.includes("Lab2")}>
          Lab 2
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link to="/Labs/Lab3" as={Link} active={pathname.includes("Lab3")}>
          Lab 3
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link to="/Labs/Lab4" as={Link} active={pathname.includes("Lab4")}>
          Lab 4
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link to="/Kambaz" as={Link}>
          Kambaz
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="https://github.com/Rae99/kambaz-react-web-app">
          My GitHub
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
}

// Yes! useLocation() is a React Router hook that returns a JavaScript object representing the current URL/location in your app.
// ✅ Structure of the object returned by useLocation()

// It looks like this:
// {
//   pathname: "/Labs/Lab1",
//   search: "?page=2",
//   hash: "#section",
//   state: null,
//   key: "abc123"
// }

// 🧠 What is a hook in React?

// A hook is a special function in React that “hooks into” React features like state, lifecycle, or routing — without using a class.

// Hooks:
// 	•	Start with use (e.g., useState, useEffect, useLocation)
// 	•	Can only be used inside functional components or other hooks
// 	•	Are a way to reuse logic and interact with React internals (like routing, state, context, etc.)

//   🧭 Why is useLocation() a hook?

// Because:
// 	•	It gives your functional component access to the router’s current location object.
// 	•	It subscribes to updates, so if the URL changes, your component will re-render automatically.
// 	•	It must be called inside a component that is a child of a <BrowserRouter> or similar.

// It’s like saying:

// “I want to subscribe to the browser’s current URL — please re-run my component when it changes.”
