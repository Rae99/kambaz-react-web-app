import Math, { add, subtract, multiply, divide } from "./Math";
import * as Matematica from "./Math"; // Importing all functions as Matematica
export default function DestructingImports() {
  return (
    <div id="wd-destructuring-imports">
      <h2>Destructing Imports</h2>
      <table className="table table-sm">
        <thead>
          <tr>
            <th>Math</th>
            <th>Matematica</th>
            <th>Functions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Math.add(2, 3) = {Math.add(2, 3)}</td>
            <td>Matematica.add(2, 3) ={Matematica.add(2, 3)}</td>
            <td>add(2, 3) = {add(2, 3)}</td>
          </tr>
          <tr>
            <td>Math.subtract(5, 1) = {Math.subtract(5, 1)}</td>
            <td>Matematica.subtract(5, 1) ={Matematica.subtract(5, 1)}</td>
            <td>subtract(5, 1) = {subtract(5, 1)}</td>
          </tr>
          {/* <td>
              doesn't work if you import Math as a default export
              Matematica.Math.subtract(5, 1) = {Matematica.Math.subtract(5, 1)}
            </td> */}
          {/* <td>
              Matematica.Math.subtract(5, 1) ={" "}
              {Matematica.default.subtract(5, 1)}
              {/* This works*/}
          {/* </td> */}

          <tr>
            <td>Math.multiply(3, 4) = {Math.multiply(3, 4)}</td>
            <td>Matematica.multiply(3, 4) ={Matematica.multiply(3, 4)}</td>
            <td>multiply(3, 4) = {multiply(3, 4)}</td>
          </tr>
          <tr>
            <td>Math.divide(8, 2) = {Math.divide(8, 2)}</td>
            <td>Matematica.divide(8, 2) ={Matematica.divide(8, 2)}</td>
            <td>divide(8, 2) = {divide(8, 2)}</td>
          </tr>
        </tbody>
      </table>
      <hr />
    </div>
  );
}

// Q: can we do Matematica.Math.subtract(), Math is a function too
// A: No, you cannot do Matematica.Math.subtract() because:
// 	•	Matematica already is the Math object that you exported from your module.
// 	•	So doing Matematica.Math doesn’t make sense — that would mean Math is a property inside Math, which it isn’t.
