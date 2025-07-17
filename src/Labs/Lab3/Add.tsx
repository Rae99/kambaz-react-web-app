export default function Add({ a, b }: { a: number; b: number }) {
  return (
    <div id="wd-add">
      <h4>Add</h4>
      <div>a = {a}</div>
      <div>b = {b}</div>
      <div>a + b = {a + b}</div>
      <hr />
    </div>
  );
}

// How to call this component:
// In JSX like <Add a={3} b={4} />, you’re passing props one by one.

// <Add { a: 3, b: 4 } /> // ❌ invalid syntax

// ✅ Q2: Why can’t we write <Add { a: 3, b: 4 } />?

// Because in JSX, props must be passed using attribute syntax, like HTML:

// const input = { a: 3, b: 4 };
// <Add {...input} />; // ✅ this is valid JSX
