import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { Container, Card, Form, Button, Row, Col } from "react-bootstrap";

function Register() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {

    e.preventDefault();

    try {

      await API.post("/auth/register", {
        name,
        email,
        password,
      });

      alert("Registration successful ✅");

      navigate("/login");

    } catch (error) {

      alert(error.response?.data?.message || "Registration failed");

    }

  };

  return (

    <Container className="mt-5">

      <Row className="justify-content-center">

        <Col md={6} lg={5}>

          <Card className="shadow-lg border-0 rounded-4">

            <Card.Body className="p-4">

              <h3 className="text-center mb-4">
                Create Account
              </h3>

              <Form onSubmit={handleRegister}>

                <Form.Group className="mb-3">

                  <Form.Label>Name</Form.Label>

                  <Form.Control
                    type="text"
                    placeholder="Enter your name"
                    onChange={(e) => setName(e.target.value)}
                    required
                  />

                </Form.Group>

                <Form.Group className="mb-3">

                  <Form.Label>Email</Form.Label>

                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />

                </Form.Group>

                <Form.Group className="mb-3">

                  <Form.Label>Password</Form.Label>

                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                </Form.Group>

                <Button
                  variant="success"
                  type="submit"
                  className="w-100 mt-2"
                >
                  Register
                </Button>

              </Form>

              <div className="text-center mt-3">

                Already have an account?{" "}
                <Link to="/login">
                  Login
                </Link>

              </div>

            </Card.Body>

          </Card>

        </Col>

      </Row>

    </Container>

  );

}

export default Register;