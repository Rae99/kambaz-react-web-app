import { useSelector, useDispatch } from "react-redux"; // to read/write to reducer
import { useState } from "react"; // // to maintain a and b parameters in UI
import { add } from "./addReducer";
import { Button, FormControl } from "react-bootstrap";
export default function AddRedux() {
  const [a, setA] = useState(12); // local state for first number
  const [b, setB] = useState(23);
  const { sum } = useSelector((state: any) => state.add); // From the Redux store, grab the add slice, then get the sum from it.
  const dispatch = useDispatch();

  // useSelector is a special React hook from Redux that lets your component “read” data from the Redux store.
  // useDispatch is another hook that gives you access to the dispatch function,
  // which you can use to send actions to the Redux store.

  return (
    <div className="w-25" id="wd-add-redux">
      <h1>Add Redux</h1>
      <h2>
        {a} + {b} = {sum}
      </h2>
      <FormControl
        type="number"
        defaultValue={a}
        onChange={(e) => setA(parseInt(e.target.value))}
      />
      <FormControl
        type="number"
        defaultValue={b}
        onChange={(e) => setB(parseInt(e.target.value))}
      />
      <Button id="wd-add-redux-click" onClick={() => dispatch(add({ a, b }))}>
        Add Redux
      </Button>
      <hr />
    </div>
  );
}
