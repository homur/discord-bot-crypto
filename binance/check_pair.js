const axios = require("axios");

// Function to check if a pair exists
async function pairExists(pair) {
  const API_URL = "https://api.binance.com/api/v3/exchangeInfo";

  try {
    const response = await axios.get(API_URL);
    const symbols = response.data.symbols.map((symbol) => symbol.symbol); // Extract all pairs

    if (symbols.includes(pair.toUpperCase())) {
      console.log(`${pair} exists on Binance!`);
      return true;
    } else {
      console.warn(`${pair} does not exist on Binance.`);
      return false;
    }
  } catch (error) {
    console.error("Error fetching trading pairs:", error.message);
    return false;
  }
}

module.exports = pairExists;
