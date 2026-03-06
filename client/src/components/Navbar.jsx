import React from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";

function AppNavbar() {

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const logout = () => {

    localStorage.removeItem("token");

    navigate("/login");

  };

  return (

    <Navbar
      bg="dark"
      variant="dark"
      expand="lg"
      sticky="top"
      className="shadow-sm"
    >

      <Container>

        {/* Brand */}

        <Navbar.Brand
          as={NavLink}
          to="/"
          className="fw-bold fs-4"
        >
          🗳️ PollPulse
        </Navbar.Brand>

        {/* Mobile toggle */}

        <Navbar.Toggle aria-controls="main-navbar" />

        <Navbar.Collapse id="main-navbar">

          {/* Left Menu */}

          <Nav className="me-auto">

            <Nav.Link
              as={NavLink}
              to="/"
            >
              Home
            </Nav.Link>

            <Nav.Link
              as={NavLink}
              to="/polls"
            >
              Polls
            </Nav.Link>

            <Nav.Link
              as={NavLink}
              to="/create"
            >
              Create Poll
            </Nav.Link>

          </Nav>

          {/* Right Menu */}

          <Nav className="align-items-center">

            {!token ? (

              <>
                <Nav.Link
                  as={NavLink}
                  to="/login"
                >
                  Login
                </Nav.Link>

                <Nav.Link
                  as={NavLink}
                  to="/register"
                >
                  Register
                </Nav.Link>
              </>

            ) : (

              <Button
                variant="outline-light"
                size="sm"
                onClick={logout}
              >
                Logout
              </Button>

            )}

          </Nav>

        </Navbar.Collapse>

      </Container>

    </Navbar>

  );

}

export default AppNavbar;