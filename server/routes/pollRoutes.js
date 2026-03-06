const express = require("express");
const router = express.Router();
const Poll = require("../models/Poll");
const protect = require("../middleware/authMiddleware");


// ======================================
// CREATE POLL
// ======================================
router.post("/create", protect, async (req, res) => {
  try {

    let { question, options, category, expiresAt } = req.body;

    if (!question || !options || options.length < 2 || !category || !expiresAt) {
      return res.status(400).json({
        message: "Please provide valid poll data"
      });
    }

    category =
      category.charAt(0).toUpperCase() +
      category.slice(1).toLowerCase();

    const formattedOptions = options.map((opt) => ({
      optionText: opt,
      votes: 0
    }));

    const poll = new Poll({
      question,
      category,
      options: formattedOptions,
      expiresAt,
      createdBy: req.user.id
    });

    await poll.save();

    res.status(201).json({
      message: "Poll created successfully ✅",
      poll
    });

  } catch (error) {

    console.log("CREATE POLL ERROR:", error);

    res.status(500).json({
      message: "Server error"
    });

  }
});


// ======================================
// GET ALL POLLS
// ======================================
router.get("/", async (req, res) => {

  try {

    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    await Poll.updateMany(
      {
        expiresAt: { $lt: new Date() },
        isExpired: false
      },
      {
        $set: { isExpired: true }
      }
    );

    const totalPolls = await Poll.countDocuments();

    const polls = await Poll.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      currentPage: page,
      totalPages: Math.ceil(totalPolls / limit),
      totalPolls,
      polls
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});


// ======================================
// FILTER BY CATEGORY
// ======================================
router.get("/category/:category", async (req, res) => {

  try {

    const polls = await Poll.find({
      category: req.params.category
    });

    res.json(polls);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});


// ======================================
// GET SINGLE POLL
// ======================================
router.get("/:id", async (req, res) => {

  try {

    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({
        message: "Poll not found"
      });
    }

    res.json(poll);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});


// ======================================
// DELETE POLL
// ======================================
router.delete("/:id", protect, async (req, res) => {

  try {

    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({
        message: "Poll not found"
      });
    }

    if (poll.createdBy.toString() !== req.user.id) {

      return res.status(401).json({
        message: "Not authorized ❌"
      });

    }

    await poll.deleteOne();

    res.json({
      message: "Poll deleted successfully ✅"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});


// ======================================
// VOTE POLL
// ======================================
router.post("/vote/:id", protect, async (req, res) => {

  try {

    const { optionIndex } = req.body;

    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({
        message: "Poll not found"
      });
    }

    if (poll.expiresAt && new Date() > poll.expiresAt) {

      poll.isExpired = true;

      await poll.save();

      return res.status(400).json({
        message: "Poll has expired ❌"
      });

    }

    if (poll.votedUsers.includes(req.user.id)) {

      return res.status(400).json({
        message: "You already voted ❌"
      });

    }

    if (!poll.options[optionIndex]) {

      return res.status(400).json({
        message: "Invalid option"
      });

    }

    poll.options[optionIndex].votes += 1;

    poll.votedUsers.push(req.user.id);

    await poll.save();

    res.json({
      message: "Vote counted successfully ✅",
      poll
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});


// ======================================
// POLL RESULTS
// ======================================
router.get("/results/:id", async (req, res) => {

  try {

    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({
        message: "Poll not found"
      });
    }

    const totalVotes = poll.options.reduce(
      (sum, option) => sum + option.votes,
      0
    );

    const results = poll.options.map((option) => ({
      optionText: option.optionText,
      votes: option.votes,
      percentage:
        totalVotes === 0
          ? "0%"
          : ((option.votes / totalVotes) * 100).toFixed(2) + "%"
    }));

    res.json({
      pollId: poll._id,
      question: poll.question,
      category: poll.category,
      expired: poll.isExpired,
      totalVotes,
      results
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});

module.exports = router;