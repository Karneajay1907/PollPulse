import React, { useState } from "react";
import axios from "axios";
import { Container, Card, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function CreatePoll() {

  const navigate = useNavigate();

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [category, setCategory] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  const handleOptionChange = (value, index) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const createPoll = async (e) => {

    e.preventDefault();

    const token = localStorage.getItem("token");

    const filteredOptions = options.filter(opt => opt.trim() !== "");

    if (filteredOptions.length < 2) {
      alert("Minimum 2 options required");
      return;
    }

    try {

      await axios.post(
        "http://localhost:5000/api/polls/create",
        {
          question,
          options: filteredOptions,
          category,
          expiresAt
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Poll created successfully ✅");

      navigate("/");

    } catch (error) {

      alert(error.response?.data?.message || "Error creating poll");

    }

  };

  return (

    <Container className="d-flex justify-content-center mt-5">

      <Card style={{ width: "520px" }} className="shadow-lg p-4 border-0">

        <h3 className="text-center mb-4">Create Poll</h3>

        <Form onSubmit={createPoll}>

          <Form.Group className="mb-3">

            <Form.Label>Question</Form.Label>

            <Form.Control
              type="text"
              placeholder="Enter poll question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            />

          </Form.Group>

          {options.map((opt, index) => (

            <Form.Group key={index} className="mb-3">

              <Form.Label>Option {index + 1}</Form.Label>

              <Form.Control
                type="text"
                placeholder={`Enter option ${index + 1}`}
                value={opt}
                onChange={(e) =>
                  handleOptionChange(e.target.value, index)
                }
              />

            </Form.Group>

          ))}

          <Form.Group className="mb-3">

            <Form.Label>Category</Form.Label>

            <Form.Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >

              <option value="">Select Category</option>
              <option value="Technology">Technology</option>
              <option value="Sports">Sports</option>
              <option value="Movies">Movies</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Education">Education</option>
              <option value="Business">Business</option>
              <option value="Politics">Politics</option>
              <option value="Gaming">Gaming</option>
              <option value="Other">Other</option>

            </Form.Select>

          </Form.Group>

          <Form.Group className="mb-3">

            <Form.Label>Poll Expiry Date</Form.Label>

            <Form.Control
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              required
            />

          </Form.Group>

          <Button variant="primary" className="w-100" type="submit">
            Create Poll
          </Button>

        </Form>

      </Card>

    </Container>

  );

}

export default CreatePoll;