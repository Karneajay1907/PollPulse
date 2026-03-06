import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Card } from "react-bootstrap";
import { useParams } from "react-router-dom";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

function PollResults() {

  const { id } = useParams();

  const [poll, setPoll] = useState(null);

  useEffect(() => {

    fetchResults();

  }, [id]);

  const fetchResults = async () => {

    try {

      const res = await axios.get(
        `http://localhost:5000/api/polls/${id}`
      );

      setPoll(res.data);

    } catch (error) {

      console.log(error);

    }

  };

  if (!poll) {

    return <h3 className="text-center mt-5">Loading Results...</h3>;

  }

  const labels = poll.options.map(o => o.optionText);
  const votes = poll.options.map(o => o.votes);

  const totalVotes = votes.reduce((a, b) => a + b, 0);

  const percentages = poll.options.map(o =>
    totalVotes ? ((o.votes / totalVotes) * 100).toFixed(1) : 0
  );

  const chartData = {

    labels: labels,

    datasets: [

      {
        label: "Votes",
        data: votes,
        backgroundColor: [
          "#0d6efd",
          "#198754",
          "#ffc107",
          "#dc3545",
          "#6f42c1"
        ]
      }

    ]

  };

  return (

    <Container className="mt-5">
      <h2 class="text-center mb-4">🗳️ Available Results Charts</h2>
      <Card className="shadow-lg border-0 p-4">

        <h2 className="text-center mb-3">

          {poll.question}

        </h2>

        <p className="text-center text-muted">

          Total Votes: {totalVotes}

        </p>

        <Bar data={chartData} />

        <hr />

        {poll.options.map((opt, index) => (

          <div
            key={index}
            className="d-flex justify-content-between mb-2"
          >

            <span>{opt.optionText}</span>

            <span>

              {opt.votes} votes ({percentages[index]}%)

            </span>

          </div>

        ))}

      </Card>

    </Container>

  );

}

export default PollResults;