import { Navbar, Nav, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
const HomeScreen = () => {
  const location = useLocation();
  const [currTab, setCurrTab] = useState(
    document.querySelector("a[href='/playlists']")
  );
  const focus = (e) => {
    setCurrTab((prev) => {
      prev?.classList?.remove("border-bottom");
      prev?.classList?.remove("border-dark");
      return e.target;
    });
  };
  useEffect(() => {
    currTab?.classList?.add("border-bottom");
    currTab?.classList?.add("border-dark");
  }, [currTab]);
  return (
    <Navbar variant="light" expand="sm">
      <Container
        fluid
        style={{
          overflowX: "scroll",
          whiteSpace: "nowrap",
          width: "100%",
        }}
      >
        <Nav
          className={`mr-auto d-inline-block ${
            location.pathname === "/playlists" || location.pathname === "/"
              ? "border-bottom border-dark"
              : ""
          }`}
          onClick={focus}
        >
          <LinkContainer to="/playlists">
            <Nav.Link>Playlists</Nav.Link>
          </LinkContainer>
        </Nav>

        <Nav className="mr-auto d-inline-block" onClick={focus}>
          <LinkContainer to="/playlists/PLZoTAELRMXVNUL99R4bDlVYsncUNvwUBB">
            <Nav.Link>Python</Nav.Link>
          </LinkContainer>
        </Nav>

        <Nav className="mr-auto d-inline-block" onClick={focus}>
          <LinkContainer to="/playlists/PLZoTAELRMXVMhVyr3Ri9IQ-t5QPBtxzJO">
            <Nav.Link>Statistics</Nav.Link>
          </LinkContainer>
        </Nav>

        <Nav className="mr-auto d-inline-block" onClick={focus}>
          <LinkContainer to="/playlists/PLZoTAELRMXVPBTrWtJkn3wWQxZkmTXGwe">
            <Nav.Link>ML</Nav.Link>
          </LinkContainer>
        </Nav>

        <Nav className="mr-auto d-inline-block" onClick={focus}>
          <LinkContainer to="/playlists/PLZoTAELRMXVPGU70ZGsckrMdr0FteeRUi">
            <Nav.Link>DL</Nav.Link>
          </LinkContainer>
        </Nav>

        <Nav className="mr-auto d-inline-block" onClick={focus}>
          <LinkContainer to="/playlists/PLZoTAELRMXVPwYGE2PXD3x0bfKnR0cJjN">
            <Nav.Link>FE</Nav.Link>
          </LinkContainer>
        </Nav>

        <Nav className="mr-auto d-inline-block" onClick={focus}>
          <LinkContainer to="/playlists/PLZoTAELRMXVMdJ5sqbCK2LiM0HhQVWNzm">
            <Nav.Link>NLP</Nav.Link>
          </LinkContainer>
        </Nav>

        <Nav className="mr-auto d-inline-block" onClick={focus}>
          <LinkContainer to="/playlists/PLZoTAELRMXVMbpd_KBoOY_ecwMsDy92gS">
            <Nav.Link>DSIQ</Nav.Link>
          </LinkContainer>
        </Nav>

        <Nav className="mr-auto d-inline-block" onClick={focus}>
          <LinkContainer to="/playlists/PLZoTAELRMXVPBaLN3e-uoVRR9hlRFRfUc">
            <Nav.Link>Flask</Nav.Link>
          </LinkContainer>
        </Nav>

        <Nav className="mr-auto d-inline-block" onClick={focus}>
          <LinkContainer to="/playlists/PLZoTAELRMXVO6U_bZCGgREUlhHKGr7IIo">
            <Nav.Link>Django</Nav.Link>
          </LinkContainer>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default HomeScreen;
