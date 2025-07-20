import { useState } from "react";
export default function ArrayStateVariable() {
  const [array, setArray] = useState([1, 2, 3, 4, 5]);
  const addElement = () => {
    setArray([...array, Math.floor(Math.random() * 100)]);
  };
  const deleteElement = (index: number) => {
    setArray(array.filter((item, i) => i !== index));
  };
  return (
    <div id="wd-array-state-variables">
      <h2>Array State Variable</h2>
      <button onClick={addElement}>Add Element</button>
      <ul>
        {array.map((item, index) => (
          <li key={index}>
            {" "}
            {item}
            <button onClick={() => deleteElement(index)}>Delete</button>
          </li>
        ))}
      </ul>
      <hr />
    </div>
  );
}

/*
   A callback is just a function that you pass to another function to be called later.
   In the case of .filter():
   array.filter(callback)
   you’re passing a function (your callback) to .filter(), and .filter() calls it for each item in the array.
   When .filter() calls your callback, it always passes three arguments:
   callback(element, index, array)

   So if you write:
   array.filter((item, i, arr) => {
  // item: the current element
  // i: index of the element
  // arr: the original array
})
  You can use all three — or just the ones you need. */

//   Great question! You’re absolutely right: .filter() is called directly on an array, so we already have access to the array. So why does the callback function get the array passed in again as a third parameter?

// ✅ Here’s why:

// The third argument (array) is just for convenience — in case you want to access the entire array inside the callback function.

// You don’t have to use it, but if you need the full array inside your logic, it’s automatically passed in.

// ✅ Example where it’s useful:

// const nums = [2, 4, 6, 8];

// const result = nums.filter((item, index, array) => {
//   // Keep only numbers greater than the average
//   const avg = array.reduce((sum, n) => sum + n, 0) / array.length;
//   return item > avg;
// });

// array.reduce((accumulator, currentValue) => ..., initialValue)
