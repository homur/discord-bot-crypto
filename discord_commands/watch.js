const pairExists = require("../binance/check_pair");
const monitorCoinPair = require("../binance/monitor_coin");

// example !watch BTCUSDT 5 10
module.exports = {
  name: "watch",
  description: "Monitor a coin pair.",
  async execute(message, args) {
    if (args.length === 0) {
      message.reply(
        "Please specify a coin pair to watch (e.g., !watch BTCUSDT)"
      );
      return;
    } else if (args.length < 3) {
      return message.reply(
        "Please specify a coin pair, percentage change, and interval (e.g., !watch BTCUSDT 5 10)."
      );
    }

    const pair = args[0].toUpperCase();
    const percentage = parseFloat(args[1]);
    const interval = parseInt(args[2], 10);

    if (isNaN(percentage) || percentage <= 0) {
      return message.reply(
        "Please provide a valid positive percentage change."
      );
    }
    if (isNaN(interval) || interval <= 0) {
      return message.reply(
        "Please provide a valid positive interval in seconds."
      );
    }

    try {
      const exists = await pairExists(pair);
      if (exists) {
        monitorCoinPair(pair, percentage, interval * 60000);
        return message.reply(`Now watching ${pair}!`);
      } else {
        return message.reply(`${pair} does not exist on Binance.`);
      }
    } catch (error) {
      return message.reply(
        "There was an error checking the pair. Please try again later."
      );
    }
  },
};
