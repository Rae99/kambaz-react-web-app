const add = (a: number, b: number) => {
  alert(`${a} + ${b} = ${a + b}`);
};
export default function PassingDataOnEvent() {
  return (
    <div id="wd-passing-data-on-event">
      <h2>Passing Data on Event</h2>
      <button
        onClick={() => add(2, 3)}
        className="btn btn-primary"
        id="wd-pass-data-click"
      >
        Pass 2 and 3 to add()
      </button>
      <hr />
    </div>
  );
}

// onClick={add(2, 3)} This is wrong and may create an infinite loop
// because it calls add immediately instead of on click

// Because lifeIs() runs during render — not on click!

// If lifeIs() contains something like setState(), it triggers a re-render,
// which causes lifeIs() to run again, and again… 🔁

// 💥 Boom → infinite re-renders!
