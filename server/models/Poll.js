const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema({
  optionText: {
    type: String,
    required: true
  },
  votes: {
    type: Number,
    default: 0
  }
});

const pollSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true
    },

    options: [optionSchema],

    category: {
      type: String,
      required: true
    },

    expiresAt: {
      type: Date,
      required: true
    },

    isExpired: {
      type: Boolean,
      default: false
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    votedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  },
  { timestamps: true }
);


// ==============================
// AUTO EXPIRE POLL
// ==============================
pollSchema.pre("save", function () {

  if (this.expiresAt && new Date() > this.expiresAt) {
    this.isExpired = true;
  }

});


module.exports = mongoose.model("Poll", pollSchema);