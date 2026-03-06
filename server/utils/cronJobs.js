const cron = require("node-cron");
const Poll = require("../models/Poll");

// Runs every minute
cron.schedule("* * * * *", async () => {
  console.log("Running Expiry Check...");

  try {
    const now = new Date();

    const expiredPolls = await Poll.updateMany(
      {
        expiresAt: { $lte: now },
        isExpired: false,
      },
      {
        $set: { isExpired: true },
      }
    );

    if (expiredPolls.modifiedCount > 0) {
      console.log(`${expiredPolls.modifiedCount} poll(s) expired.`);
    }
  } catch (error) {
    console.log("Cron Error:", error.message);
  }
});
