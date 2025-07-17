import Lab1 from "./Lab1";
import { Route, Routes, Navigate } from "react-router";
import TOC from "./TOC";
import Lab2 from "./Lab2";
import Lab3 from "./Lab3";
export default function Labs() {
  console.log("Hello World!");
  return (
    <div>
      <h1>Labs</h1>
      <p>Junrui Ding</p>
      <p>CS5610 Web Development summer - 2 2025.</p>
      <a id="wd-github" href="https://github.com/Rae99/kambaz-react-web-app">
        GitHub Repository
      </a>
      <TOC />
      <Routes>
        <Route path="/" element={<Navigate to="Lab1" />} />
        <Route path="Lab1" element={<Lab1 />} />
        <Route path="Lab2/*" element={<Lab2 />} />
        <Route path="Lab3/*" element={<Lab3 />} />
      </Routes>
    </div>
  );
}
