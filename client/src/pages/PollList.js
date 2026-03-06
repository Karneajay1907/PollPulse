import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  Button,
  Container,
  Badge,
  Row,
  Col,
  Form,
  Spinner,
  Pagination
} from "react-bootstrap";
import { Link } from "react-router-dom";

function PollList() {

  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPolls();
  }, [page, category, search]);

  const fetchPolls = async () => {

    try {

      setLoading(true);

      const res = await axios.get(
        `http://localhost:5000/api/polls?page=${page}&category=${category}&search=${search}`
      );

      setPolls(res.data.polls);
      setTotalPages(res.data.totalPages);

      setLoading(false);

    } catch (error) {

      console.log(error);

    }

  };

  const isExpired = (expiryDate) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  return (

    <Container className="mt-4">

      <h2 className="text-center mb-4">🗳️ Available Polls</h2>

      {/* FILTER SECTION */}

      <Row className="mb-4">

        <Col md={4}>

          <Form.Control
            placeholder="Search Poll..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </Col>

        <Col md={4}>

          <Form.Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >

            <option value="">All Categories</option>
            <option value="Technology">Technology</option>
            <option value="Sports">Sports</option>
            <option value="Politics">Politics</option>
            <option value="Education">Education</option>
            <option value="Entertainment">Entertainment</option>

          </Form.Select>

        </Col>

        <Col md={4}>

          <Button
            variant="primary"
            onClick={() => {
              setPage(1);
              fetchPolls();
            }}
          >
            Apply Filter
          </Button>

        </Col>

      </Row>

      {/* LOADING */}

      {loading ? (

        <div className="text-center">

          <Spinner animation="border" />

        </div>

      ) : (

        <Row>

          {polls.length === 0 && (

            <p className="text-center">No polls found</p>

          )}

          {polls.map((poll) => {

            const expired = isExpired(poll.expiresAt);

            return (

              <Col md={6} lg={4} key={poll._id}>

                <Card className="mb-4 shadow-sm">

                  <Card.Body>

                    <div className="d-flex justify-content-between align-items-center mb-2">

                      <Card.Title className="mb-0">
                        {poll.question}
                      </Card.Title>

                      {expired ? (
                        <Badge bg="danger">
                          Expired
                        </Badge>
                      ) : (
                        <Badge bg="success">
                          Active
                        </Badge>
                      )}

                    </div>

                    <Badge bg="info" className="mb-2">
                      {poll.category}
                    </Badge>

                    {poll.expiresAt && (

                      <Card.Text className="text-muted">

                        Expires: {new Date(poll.expiresAt).toLocaleString()}

                      </Card.Text>

                    )}

                    <div className="d-flex gap-2">

                      <Link to={`/poll/${poll._id}`}>

                        <Button
                        variant={expired ? "secondary" : "primary"}
                        disabled={expired}
                        >

                        {expired ? "Poll Closed" : "Vote"}

                        </Button>

                      </Link>

                      <Link to={`/results/${poll._id}`}>

                        <Button variant="outline-dark">

                      Results

                        </Button>

                      </Link>

                    </div>
                  </Card.Body>

                </Card>

              </Col>

            );

          })}

        </Row>

      )}

      {/* PAGINATION */}

      <div className="d-flex justify-content-center mt-4">

        <Pagination>

          <Pagination.Prev
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          />

          <Pagination.Item active>
            {page}
          </Pagination.Item>

          <Pagination.Next
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          />

        </Pagination>

      </div>

    </Container>

  );

}

export default PollList;