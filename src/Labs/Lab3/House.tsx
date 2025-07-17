export default function House() {
  const house = {
    bedrooms: 4,
    bathrooms: 2.5,
    squareFeet: 2000,
    address: {
      street: "Via Roma",
      city: "Roma",
      state: "RM",
      zip: "00100",
      country: "Italy",
    },
    owners: ["Alice", "Bob"],
  }; // All keys in JavaScript objects are strings — even if you don’t put quotes around them.
  // 	Note: Python requires keys to be quoted if they’re strings.

  console.log(house);

  return (
    <div id="wd-house">
      <h4>House</h4>
      <h5>bedrooms</h5> {house.bedrooms}
      <h5>bathrooms</h5> {house.bathrooms}
      <h5>Data</h5>
      <pre>{JSON.stringify(house, null, 2)}</pre>
      <hr />
    </div>
  );
}

// Note: JSON.stringify() converts a JavaScript object into a JSON string.
// The second argument (null) is for a replacer function, which we don't need here.
// The third argument (2) is for pretty-printing the JSON with 2 spaces of indentation

// about the second argument:
// If you want to filter out certain properties, you can provide a function as the second argument

// Example code snippet for filtering properties:

// const obj = { a: 1, b: 2, c: 3 };
// const jsonString = JSON.stringify(obj, (key, value) =>
//   key === "b" ? undefined : value
// );

// console.log(jsonString); // ➜ '{"a":1,"c":3}'
// console.log(obj);        // ➜ { a: 1, b: 2, c: 3 } ✅
