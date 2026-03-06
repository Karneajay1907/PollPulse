const Poll = require("../models/Poll");


// ===============================
// CREATE POLL
// ===============================
exports.createPoll = async (req, res) => {
  try {
    const { question, category, options, expiresAt } = req.body;

    const poll = new Poll({
      question,
      category,
      options: options.map((opt) => ({ optionText: opt })),
      createdBy: req.user.id,
      expiresAt,
    });

    await poll.save();

    res.status(201).json({
      message: "Poll created successfully",
      poll,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ===============================
// GET ALL POLLS
// ===============================
exports.getAllPolls = async (req, res) => {
  try {

    const polls = await Poll.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json(polls);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ===============================
// GET SINGLE POLL
// ===============================
exports.getPollById = async (req, res) => {
  try {

    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    res.json(poll);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ===============================
// VOTE POLL (STEP 8.2 + STEP 9.3)
// ===============================
exports.votePoll = async (req, res) => {
  try {

    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({
        message: "Poll not found",
      });
    }

    // Check if poll expired
    if (poll.expiresAt < new Date()) {
      poll.isExpired = true;
      await poll.save();

      return res.status(400).json({
        message: "This poll has expired",
      });
    }

    // Check if user already voted
    if (poll.votedUsers.includes(req.user.id)) {
      return res.status(400).json({
        message: "You already voted",
      });
    }

    const { optionIndex } = req.body;

    // Increase vote
    poll.options[optionIndex].votes += 1;

    // Add user to voted list
    poll.votedUsers.push(req.user.id);

    await poll.save();

    // ===============================
    // REAL-TIME UPDATE (STEP 9.3)
    // ===============================
    if (global.io) {
      global.io.emit("pollVoteUpdate", poll);
    }

    res.json({
      message: "Vote submitted successfully",
      poll,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ===============================
// POLL RESULTS (STEP 8.4)
// ===============================
exports.getPollResults = async (req, res) => {
  try {

    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({
        message: "Poll not found",
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
          ? 0
          : ((option.votes / totalVotes) * 100).toFixed(1),
    }));

    res.json({
      question: poll.question,
      totalVotes,
      results,
      isExpired: poll.isExpired,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};