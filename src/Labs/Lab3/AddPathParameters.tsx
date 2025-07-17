import { useParams } from "react-router-dom";
export default function AddPathParameters() {
  const { a, b } = useParams(); // a and b are path parameters (strings)
  return (
    <div id="wd-add">
      {" "}
      <h4>Add Path Parameters</h4>
      {a} + {b} = {parseInt(a as string) + parseInt(b as string)}
    </div>
  );
}

// useParams() is a special React Router hook that lets you access the URL path parameters like :a and :b.

// a as string

// This is TypeScript syntax that tells the compiler:

// “Trust me, a is a string.”

// Why? Because useParams() returns an object where all values are strings or undefined, so TypeScript needs reassurance.
