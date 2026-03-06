import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Form,
  InputGroup
} from "react-bootstrap";
import { Link } from "react-router-dom";

function Home() {

  const [polls, setPolls] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPolls();
  }, [page, category]);

  const fetchPolls = async () => {

    try {

      let url = `http://localhost:5000/api/polls?page=${page}`;

      if (category) {
        url = `http://localhost:5000/api/polls/category/${category}`;
      }

      const res = await axios.get(url);

      if (category) {
        setPolls(res.data);
      } else {
        setPolls(res.data.polls);
        setTotalPages(res.data.totalPages);
      }

    } catch (error) {
      console.log(error);
    }

  };

  // SEARCH FILTER
  const filteredPolls = polls.filter((poll) =>
    poll.question.toLowerCase().includes(search.toLowerCase())
  );

  return (

    <div>

      {/* HERO HEADER */}

      <div
        style={{
          background: "linear-gradient(135deg,#0d6efd,#6610f2)",
          padding: "60px 0",
          color: "white"
        }}
      >

        <Container>

          <h1 className="fw-bold text-center">
            🗳️ PollPulse Dashboard
          </h1>

          <p className="text-center">
            Create polls, vote instantly and view real-time results
          </p>

        </Container>

      </div>

      <Container className="mt-5">

        {/* SEARCH + FILTER */}

        <Row className="mb-4">

          <Col md={6}>

            <InputGroup>

              <Form.Control
                placeholder="Search polls..."
                onChange={(e) => setSearch(e.target.value)}
              />

            </InputGroup>

          </Col>

          <Col md={4}>

            <Form.Select
              onChange={(e) => setCategory(e.target.value)}
            >

              <option value="">All Categories</option>
              <option value="Technology">Technology</option>
              <option value="Sports">Sports</option>
              <option value="Movies">Movies</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Education">Education</option>

            </Form.Select>

          </Col>

          <Col md={2}>

            <Button
              as={Link}
              to="/create"
              variant="success"
              className="w-100"
            >
              + Create
            </Button>

          </Col>

        </Row>

        {/* POLL CARDS */}

        <Row>

          {filteredPolls.length === 0 ? (

            <h5 className="text-center text-muted">
              No polls found
            </h5>

          ) : (

            filteredPolls.map((poll) => {

              const isExpired =
                poll.expiresAt &&
                new Date(poll.expiresAt) < new Date();

              return (

                <Col md={4} className="mb-4" key={poll._id}>

                  <Card className="shadow-sm border-0 h-100">

                    <Card.Body>

                      <Card.Title className="fw-bold">
                        {poll.question}
                      </Card.Title>

                      <div className="mb-2">

                        <Badge bg="secondary" className="me-2">
                          {poll.category}
                        </Badge>

                        {isExpired ?
                          <Badge bg="danger">Expired</Badge> :
                          <Badge bg="success">Active</Badge>
                        }

                      </div>

                      <p className="text-muted">
                        Ends: {new Date(poll.expiresAt).toLocaleString()}
                      </p>

                      <div className="d-flex justify-content-between">

                        <Button
                          as={Link}
                          to={`/poll/${poll._id}`}
                          variant="primary"
                          size="sm"
                        >
                          Vote
                        </Button>

                        <Button
                          as={Link}
                          to={`/results/${poll._id}`}
                          variant="outline-dark"
                          size="sm"
                        >
                          Results
                        </Button>

                      </div>

                    </Card.Body>

                  </Card>

                </Col>

              );

            })

          )}

        </Row>

        {/* PAGINATION */}

        {!category && totalPages > 1 && (

          <div className="text-center mt-4">

            <Button
              variant="outline-primary"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="me-2"
            >
              Previous
            </Button>

            <span className="fw-bold">
              Page {page} / {totalPages}
            </span>

            <Button
              variant="outline-primary"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="ms-2"
            >
              Next
            </Button>

          </div>

        )}

      </Container>

    </div>

  );

}

export default Home;