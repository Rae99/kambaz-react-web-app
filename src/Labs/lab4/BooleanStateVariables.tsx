import { useState } from "react";
export default function BooleanStateVariables() {
  const [done, setDone] = useState(true);
  return (
    <div id="wd-boolean-state-variables">
      <h2>Boolean State Variables</h2>
      <p>{done ? "Done" : "Not done"}</p>
      <label className="form-control">
        <input type="checkbox" checked={done} onChange={() => setDone(!done)} />{" "}
        Done
      </label>
      {done && <div className="alert alert-success">Yay! you are done</div>}
      <hr />
    </div>
  );
}

// 🔘 onClick
// 	•	Triggers when the checkbox is clicked, even if the checked state doesn’t change.
//  About this see explanation at the end of this file.

// 	•	Doesn’t handle keyboard interaction (like using spacebar to toggle checkbox).

// ✅ onChange
// 	•	Fires only when the checkbox’s state actually changes (checked ↔️ unchecked).
// 	•	Works with both mouse and keyboard (spacebar toggling).
// 	•	React uses this to keep the UI in sync with the internal state.

// <input
//   type="checkbox"
//   checked={true}
//   disabled
//   onClick={() => console.log("clicked")}
//   onChange={() => console.log("changed")}
// />
// 	If you click it:
// 	•	✅ onClick will still fire.
// 	•	❌ onChange won’t fire, because the value didn’t change — it stayed checked.

//   ⚠️ Even with non-disabled checkboxes:

// If you click very quickly (double-click, or click but the app doesn’t update immediately), onClick might fire before the state updates.

// React doesn’t trust onClick for form inputs, because it doesn’t guarantee the value actually changed.
