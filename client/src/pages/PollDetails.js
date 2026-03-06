import React, { useEffect, useState } from "react";
import axios from "axios";
import socket from "../socket";
import { useParams } from "react-router-dom";

import {
  Container,
  Card,
  Button,
  Row,
  Col,
  ProgressBar,
  Badge,
  Form,
  InputGroup
} from "react-bootstrap";

import { Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function PollDetails() {

  const { id } = useParams();

  const [poll, setPoll] = useState(null);
  const [search, setSearch] = useState("");
  const [countdown, setCountdown] = useState("");

  // ==============================
  // FETCH POLL
  // ==============================
  const fetchPoll = async () => {

    try {

      const res = await axios.get(
        `http://localhost:5000/api/polls/${id}`
      );

      setPoll(res.data);

    } catch (error) {

      console.log(error);

    }

  };

  // ==============================
  // LOAD POLL + REALTIME
  // ==============================
  useEffect(() => {

    fetchPoll();

    const interval = setInterval(fetchPoll, 5000);

    socket.on("pollVoteUpdate", (updatedPoll) => {

      if (updatedPoll._id === id) {

        setPoll(updatedPoll);

      }

    });

    return () => {

      clearInterval(interval);
      socket.off("pollVoteUpdate");

    };

  }, [id]);



  // ==============================
  // EXPIRATION COUNTDOWN
  // ==============================
  useEffect(() => {

    const timer = setInterval(() => {

      if (!poll?.expiresAt) return;

      const diff =
        new Date(poll.expiresAt) - new Date();

      if (diff <= 0) {

        setCountdown("Poll Expired");

        return;

      }

      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      setCountdown(`${hours}h ${minutes}m ${seconds}s`);

    }, 1000);

    return () => clearInterval(timer);

  }, [poll]);


  // ==============================
  // VOTE FUNCTION
  // ==============================
  const votePoll = async (index) => {

    try {

      const token = localStorage.getItem("token");

      if (!token) {

        alert("Please login to vote");
        return;

      }

      await axios.post(
        `http://localhost:5000/api/polls/vote/${id}`,
        { optionIndex: index },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Vote submitted successfully ✅");

      fetchPoll();

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "You may have already voted"
      );

    }

  };

  if (!poll) {

    return <h2 className="text-center mt-5">Loading Poll...</h2>;

  }


  // ==============================
  // TOTAL VOTES
  // ==============================
  const totalVotes = poll.options.reduce(
    (sum, option) => sum + option.votes,
    0
  );


  // ==============================
  // CHECK EXPIRATION
  // ==============================
  const isExpired =
    poll.expiresAt && new Date(poll.expiresAt) < new Date();


  // ==============================
  // SEARCH FILTER
  // ==============================
  const filteredOptions = poll.options.filter((opt) =>
    opt.optionText.toLowerCase().includes(search.toLowerCase())
  );


  // ==============================
  // CHART DATA
  // ==============================
  const chartData = {

    labels: poll.options.map(o => o.optionText),

    datasets: [
      {
        label: "Votes",
        data: poll.options.map(o => o.votes),
        backgroundColor: [
          "#0d6efd",
          "#dc3545",
          "#198754",
          "#ffc107",
          "#6f42c1"
        ]
      }
    ]

  };


  const chartOptions = {

    responsive: true,

    plugins: {

      legend: { position: "top" },

      title: {
        display: true,
        text: "Live Poll Results"
      }

    }

  };


  // ==============================
  // SHARE POLL
  // ==============================
  const sharePoll = () => {

    const link = window.location.href;

    navigator.clipboard.writeText(link);

    alert("Poll link copied 🔗");

  };


  return (

    <Container className="mt-5">

      <Row className="g-4">

        {/* LEFT SIDE */}

        <Col md={6}>

          <Card className="shadow-lg border-0 p-4">

            <h3 className="mb-3">

              {poll.question}

            </h3>


            {/* CATEGORY + STATUS */}

            <div className="mb-3">

              <Badge bg="secondary" className="me-2">

                {poll.category}

              </Badge>

              {isExpired ? (

                <Badge bg="danger">

                  Expired

                </Badge>

              ) : (

                <Badge bg="success">

                  Active

                </Badge>

              )}

            </div>


            {/* COUNTDOWN */}

            {!isExpired && (

              <p className="text-muted">

                ⏳ Ends in: {countdown}

              </p>

            )}


            {/* TOTAL VOTES */}

            <p className="text-muted">

              Total Votes: {totalVotes}

            </p>


            {/* SHARE */}

            <Button
              variant="outline-dark"
              size="sm"
              className="mb-3"
              onClick={sharePoll}
            >

              Share Poll 🔗

            </Button>


            <hr />


            {/* SEARCH OPTIONS */}

            <InputGroup className="mb-3">

              <Form.Control
                placeholder="Search options..."
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </InputGroup>


            <h5 className="mb-3">

              Vote for an option

            </h5>


            {/* OPTIONS */}

            {filteredOptions.map((option, index) => {

              const percent = totalVotes
                ? ((option.votes / totalVotes) * 100).toFixed(1)
                : 0;

              return (

                <div key={index} className="mb-3">

                  <Button
                    className="w-100 mb-1"
                    variant="outline-primary"
                    disabled={isExpired}
                    onClick={() => votePoll(index)}
                  >

                    {option.optionText}
                    {" "}
                    ({option.votes} votes)

                  </Button>


                  <ProgressBar
                    animated
                    now={percent}
                    label={`${percent}%`}
                  />

                </div>

              );

            })}


            {isExpired && (

              <p className="text-danger mt-3">

                Voting is closed for this poll.

              </p>

            )}

          </Card>

        </Col>


        {/* RIGHT SIDE */}

        <Col md={6}>

          <Card className="shadow-lg border-0 p-4">

            <h4 className="text-center mb-4">

              Live Results 📊

            </h4>

            <Bar
              data={chartData}
              options={chartOptions}
            />

          </Card>

        </Col>

      </Row>

    </Container>

  );

}

export default PollDetails;