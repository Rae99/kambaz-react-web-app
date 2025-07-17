import { ListGroup } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
export default function CourseNavigation() {
  const location = useLocation();
  const pathname = location.pathname;
  const links = [
    "Home",
    "Modules",
    "Piazza",
    "Zoom",
    "Assignments",
    "Quizzes",
    "Grades",
    "People",
  ];
  const { cid } = useParams();
  return (
    
    <ListGroup
      id="wd-courses-navigation"
      className="wd list-group fs-5 rounded-0"
    >
      {links.map((link) => (
        <ListGroup.Item
          as={Link}
          to={`/Kambaz/Courses/${cid}/${link}`}
          key={link}
          className={`text-decoration-none list-group-item ${
            pathname.includes(link)
              ? "text-black active"
              : "text-danger"
          } border border-0`}
        >
          {link}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}
