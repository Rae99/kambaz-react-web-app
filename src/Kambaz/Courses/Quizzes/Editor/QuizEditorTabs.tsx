import { NavLink } from 'react-router-dom';

/**
 * QuizEditorTabs Component
 *
 * Manages the navigation tabs between Details and Questions:
 * - Provides tab navigation for quiz editor sections
 * - Handles active state styling for current tab
 * - Routes between quiz details and questions editing
 * - Uses React Router for navigation and active state management
 *
 * This component creates the tab interface that allows users to switch
 * between editing quiz metadata and quiz questions.
 */

interface QuizEditorTabsProps {
  cid: string;
  qid: string;
}

export default function QuizEditorTabs({ cid, qid }: QuizEditorTabsProps) {
  return (
    <ul className="nav nav-tabs mb-4">
      <li className="nav-item">
        <NavLink
          to={`/Kambaz/Courses/${cid}/Quizzes/${qid}/edit/details`}
          end
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          Details
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink
          to={`/Kambaz/Courses/${cid}/Quizzes/${qid}/edit/questions`}
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          Questions
        </NavLink>
      </li>
    </ul>
  );
}
