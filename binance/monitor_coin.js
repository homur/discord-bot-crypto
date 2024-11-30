const WebSocket = require("ws");

// Function to monitor coin pair
function monitorCoinPair(pair, thresholdPercentage = 2, intervalMs = 5000) {
  const ws = new WebSocket(
    `wss://stream.binance.com:9443/ws/${pair.toLowerCase()}@trade`
  );

  let initialPrice = null;
  let currentPrice = null;

  ws.on("open", () => {
    console.log(`Started monitoring ${pair}...`);
  });

  ws.on("message", (data) => {
    const trade = JSON.parse(data);
    currentPrice = parseFloat(trade.p);
    if (!initialPrice) initialPrice = currentPrice;
  });

  const interval = setInterval(() => {
    if (initialPrice !== null && currentPrice !== null) {
      const changePercent =
        ((currentPrice - initialPrice) / initialPrice) * 100;

      if (Math.abs(changePercent) >= thresholdPercentage) {
        console.warn(
          `🚨 Warning! ${pair} moved ${changePercent.toFixed(2)}% in the last ${intervalMs / 1000} seconds!`
        );
      }
    }

    const d = new Date();
    console.log(
      `${d.toLocaleTimeString()}: Resetting initial price for ${pair}. Previous price: ${initialPrice}, Current price: ${currentPrice}, Interval: ${intervalMs}ms.`
    );
    initialPrice = currentPrice;
  }, intervalMs);

  ws.on("error", (error) => {
    console.error(`WebSocket error for ${pair}:`, error);
    clearInterval(interval);
  });

  ws.on("close", () => {
    console.log(`Stopped monitoring ${pair}.`);
    clearInterval(interval);
  });
}

module.exports = monitorCoinPair;
