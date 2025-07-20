import { useState } from "react";
import { FormControl } from "react-bootstrap";
export default function StringStateVariables() {
  const [firstName, setFirstName] = useState("John");
  return (
    <div>
      <h2>String State Variables</h2>
      <p>{firstName}</p>
      <FormControl
        defaultValue={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <hr />
    </div>
  );
}

// e.target.value
// What does this code do?
// e is the event object from the browser.
// 	•	e.target refers to the DOM element that triggered the event — in this case, the input box (<input>).
// 	•	e.target.value is the current text inside that input box.

/* <FormControl>   </FormControl>
This is a React Bootstrap component, and under the hood, it actually renders to: */

/* <input type="text" class="form-control" ... /> */

/* <label className="form-control">
  <input type="checkbox" checked={done} onChange={() => setDone(!done)} />
  Done
</label>
This is a native HTML element, and you’re manually applying the Bootstrap form-control class for styling. */
