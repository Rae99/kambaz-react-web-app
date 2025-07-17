export default function JsonStringify() {
  const squares = [1, 4, 16, 25, 36];
  return (
    <div className="wd-json-stringify">
      <h3>JSON Stringify</h3>
      squares = {JSON.stringify(squares)}
      <hr />
    </div>
  );
}

// The suffix -ify means: “to make into” or “to turn into”
// 🔍 What JSON.stringify() really does:
// It serializes (i.e., converts) a JavaScript value into a JSON-formatted string — keeping the structure and data as-is, but turning it into a text representation.
