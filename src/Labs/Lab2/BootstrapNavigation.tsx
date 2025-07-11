import { Button, Card, Nav } from "react-bootstrap";

export default function BootstrapNavigation() {
  return (
    <div id="wd-css-navigating-with-tabs">
      <h2>Tabs</h2>
      <Nav variant="tabs">
        <Nav.Item>
          <Nav.Link href="#/Labs/Lab2/Active">Active</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="#/Labs/Lab2/Link1">Link 1</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="#/Labs/Lab2/Link2">Link 2</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="#/Labs/Lab2/Disabled" disabled>
            Disabled
          </Nav.Link>
        </Nav.Item>
      </Nav>

      <div id="wd-css-navigating-with-cards">
        <h2>Cards</h2>
        <Card style={{ width: "18rem" }}>
          <Card.Img variant="top" src="images/cherry_blossom_junrui.jpg" />
          <Card.Body>
            <Card.Title>Cherry Blossom in David Lam Park</Card.Title>
            <Card.Text>
              A beautiful view of cherry blossoms in Vancouver's David Lam Park.
              Shot by Junrui Ding.
            </Card.Text>
            <Button variant="primary">Boldly Go</Button>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

/* rem - relative to the root element's font size, typically 16px.
   width: "18rem" - sets the width of the card to 18 times the root font size, which is 288px (18 * 16).
   variant="top" - specifies the position of the image in the card.
   variant="primary" - applies a primary style to the button, which is typically a blue color in Bootstrap.
   
   variant is an overloaded term in React Bootstrap.
   */
