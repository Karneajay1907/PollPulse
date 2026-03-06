import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { Container, Card, Form, Button, Row, Col } from "react-bootstrap";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const res = await API.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);

      alert("Login successful ✅");

      navigate("/");

    } catch (error) {

      alert(error.response?.data?.message || "Login failed");

    }

  };

  return (

    <Container className="mt-5">

      <Row className="justify-content-center">

        <Col md={6} lg={5}>

          <Card className="shadow-lg border-0 rounded-4">

            <Card.Body className="p-4">

              <h3 className="text-center mb-4">
                Login
              </h3>

              <Form onSubmit={handleLogin}>

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
                  variant="primary"
                  type="submit"
                  className="w-100 mt-2"
                >
                  Login
                </Button>

              </Form>

              <div className="text-center mt-3">

                Don't have an account?{" "}
                <Link to="/register">
                  Register
                </Link>

              </div>

            </Card.Body>

          </Card>

        </Col>

      </Row>

    </Container>

  );

}

export default Login;