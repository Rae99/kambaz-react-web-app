import { useState } from "react";

export default function ArrayStateVariable() {
  const [array, setArray] = useState([1, 2, 3, 4, 5]);
  
  const addElement = () => {
    setArray([...array, Math.floor(Math.random() * 100)]);
  };
  
  const deleteElement = (index: number) => {
    setArray(array.filter((_, i) => i !== index));
  };
  
  return (
    <div id="wd-array-state-variables" className="p-2 bg-white rounded">
      <h2>Array State Variable</h2>
      <button className="btn btn-success mb-3" onClick={addElement}>
        Add Element
      </button>
      <ul className="list-group">
        {array.map((item, index) => (
          <li
            className="list-group-item d-flex align-items-center"
            key={index}
          >
            <span className="fw-bold fs-4 me-auto">{item}</span>
            <button 
              className="btn btn-danger btn-sm" 
              onClick={() => deleteElement(index)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <hr />
    </div>
  );
}