import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AppNavbar from "./components/Navbar";

import Home from "./pages/Home";
import PollList from "./pages/PollList";
import CreatePoll from "./pages/CreatePoll";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PollDetails from "./pages/PollDetails";
import PollResults from "./pages/PollResults";

function App() {

  return (

    <BrowserRouter>

      <AppNavbar />

      <div style={{ paddingTop: "20px", minHeight: "90vh" }}>

        <Routes>

          <Route path="/" element={<Home />} />

          <Route path="/polls" element={<PollList />} />

          <Route path="/create" element={<CreatePoll />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route path="/poll/:id" element={<PollDetails />} />

          <Route path="/results/:id" element={<PollResults />} />

        </Routes>

      </div>

    </BrowserRouter>

  );

}

export default App;