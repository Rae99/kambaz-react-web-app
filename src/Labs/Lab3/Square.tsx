import type { ReactNode } from "react";

export default function Square({ children }: { children: ReactNode }) {
  const num = Number(children);
  return <span id="wd-square">{num * num}</span>;
}

//  Square is a React component and not a regular function
// 	•	It returns JSX: <span>...</span> ← only React components do that.
// 	•	It accepts a props object, specifically destructured to { children }, which is the standard way React passes props.

// If a function:
// 	•	Starts with a capital letter
// 	•	Returns JSX
// 	•	Is used like <ComponentName />

// …it’s a React component.

// For us to use a component like this:
// <Square>4</Square>
// We cannot use custom props. We should use the children prop.

// 🧩 children is not just a convention — it’s a built-in prop in React.

// React automatically passes the content between the tags (4) to your component function as a prop named children.

// This works even if you don’t write children=4 explicitly.
