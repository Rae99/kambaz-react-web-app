import { FaCheckCircle, FaCircle } from "react-icons/fa";
export default function GreenCheckmark() {
  return (
    <span className="me-1 position-relative">
      <FaCheckCircle
        style={{ top: "2px" }}
        className="text-success me-1 position-absolute fs-5"
      />
      <FaCircle className="text-white me-1 fs-6" />
    </span>
  );
}

/*
    This approach uses two overlapping icons to create a layered effect:

FaCheckCircle (green) - Provides the green circle background and checkmark outline
FaCircle (white) - Acts as a "mask" or background layer

text-success: makes it green.
	•	fs-5: sets font-size to a medium size.
	•	position-absolute: it’s placed absolutely over the span.
	•	top: "2px": nudges it downward slightly so it visually aligns better.
	•	me-1: gives it a little spacing to the right, in case another icon follows.

🟦 <span className="me-1 position-relative">
	•	A container that holds the two icons.
	•	position-relative: This is crucial — it allows any absolutely positioned children to be placed relative to this span, not the page.
	•	me-1: Bootstrap class that adds margin-end (right margin)
    */
